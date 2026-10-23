package com.quizbuilder.controller;

import com.quizbuilder.dto.AttemptHistoryDTO;
import com.quizbuilder.dto.AttemptResultDTO;
import com.quizbuilder.dto.StartQuizResponseDTO;
import com.quizbuilder.dto.SubmitQuizRequestDTO;
import com.quizbuilder.service.AttemptService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attempts")
public class AttemptController {

    private final AttemptService attemptService;

    public AttemptController(AttemptService attemptService) {
        this.attemptService = attemptService;
    }

    @PostMapping("/start/{categoryId}")
    public ResponseEntity<StartQuizResponseDTO> startQuiz(
            @PathVariable Long categoryId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        StartQuizResponseDTO response = attemptService.startQuiz(categoryId, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/submit")
    public ResponseEntity<AttemptResultDTO> submitQuiz(
            @Valid @RequestBody SubmitQuizRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        AttemptResultDTO result = attemptService.submitQuiz(request, userDetails.getUsername());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{attemptId}/result")
    public ResponseEntity<AttemptResultDTO> getAttemptResult(
            @PathVariable Long attemptId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        AttemptResultDTO result = attemptService.getAttemptResult(attemptId, userDetails.getUsername());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<AttemptHistoryDTO>> getMyHistory(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<AttemptHistoryDTO> history = attemptService.getUserHistory(userDetails.getUsername());
        return ResponseEntity.ok(history);
    }
}
