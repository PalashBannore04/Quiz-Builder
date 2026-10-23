package com.quizbuilder.service;

import com.quizbuilder.dto.AuthRequest;
import com.quizbuilder.dto.AuthResponse;
import com.quizbuilder.dto.RegisterRequest;
import com.quizbuilder.dto.UserDTO;
import com.quizbuilder.entity.User;
import com.quizbuilder.exception.BadRequestException;
import com.quizbuilder.exception.ResourceNotFoundException;
import com.quizbuilder.repository.UserRepository;
import com.quizbuilder.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER"); // Candidates register as ROLE_USER

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication, savedUser.getId(), savedUser.getRole(), savedUser.getName());

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        String jwt = tokenProvider.generateToken(authentication, user.getId(), user.getRole(), user.getName());

        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }

    public User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
