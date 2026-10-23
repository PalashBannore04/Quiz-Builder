package com.quizbuilder.service;

import com.quizbuilder.dto.CategoryCreateUpdateDTO;
import com.quizbuilder.dto.CategoryDTO;
import com.quizbuilder.dto.CategorySummaryDTO;
import com.quizbuilder.entity.Attempt;
import com.quizbuilder.entity.Category;
import com.quizbuilder.entity.User;
import com.quizbuilder.exception.ResourceNotFoundException;
import com.quizbuilder.repository.AttemptRepository;
import com.quizbuilder.repository.CategoryRepository;
import com.quizbuilder.repository.QuestionRepository;
import com.quizbuilder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;
    private final AttemptRepository attemptRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository,
                           QuestionRepository questionRepository,
                           AttemptRepository attemptRepository,
                           UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.userRepository = userRepository;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAllByOrderByTitleAsc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToDTO(category);
    }

    public List<CategorySummaryDTO> getCandidateCategories(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        List<Category> categories = categoryRepository.findAllByOrderByTitleAsc();
        List<CategorySummaryDTO> summaries = new ArrayList<>();

        for (Category category : categories) {
            CategorySummaryDTO dto = new CategorySummaryDTO();
            dto.setId(category.getId());
            dto.setTitle(category.getTitle());
            dto.setDescription(category.getDescription());
            dto.setDifficulty(category.getDifficulty());
            dto.setTimerMinutes(category.getTimerMinutes());
            dto.setQuestionCount(questionRepository.countByCategoryId(category.getId()));

            List<Attempt> userAttempts = attemptRepository.findByUserIdAndCategoryIdOrderByAttemptNumberAsc(user.getId(), category.getId());
            int completedCount = 0;
            Integer baselineScore = null;
            Integer retakeScore = null;
            Integer highestScore = null;
            Long lastAttemptId = null;

            for (Attempt attempt : userAttempts) {
                if ("COMPLETED".equals(attempt.getStatus()) || "TIMED_OUT".equals(attempt.getStatus())) {
                    completedCount++;
                    if (attempt.getAttemptNumber() == 1) {
                        baselineScore = attempt.getScore();
                    } else if (attempt.getAttemptNumber() == 2) {
                        retakeScore = attempt.getScore();
                    }
                    if (highestScore == null || attempt.getScore() > highestScore) {
                        highestScore = attempt.getScore();
                    }
                    lastAttemptId = attempt.getId();
                } else if ("IN_PROGRESS".equals(attempt.getStatus())) {
                    // Ongoing attempt also counts towards quota
                    completedCount++;
                    lastAttemptId = attempt.getId();
                }
            }

            dto.setAttemptsUsed(completedCount);
            dto.setMaxAttempts(2);
            dto.setLocked(completedCount >= 2);
            dto.setBaselineScore(baselineScore);
            dto.setRetakeScore(retakeScore);
            dto.setHighestScore(highestScore);
            dto.setLastAttemptId(lastAttemptId);

            summaries.add(dto);
        }

        return summaries;
    }

    @Transactional
    public CategoryDTO createCategory(CategoryCreateUpdateDTO dto) {
        Category category = new Category();
        category.setTitle(dto.getTitle().trim());
        category.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : "");
        category.setDifficulty(dto.getDifficulty().trim());
        category.setTimerMinutes(dto.getTimerMinutes());

        Category saved = categoryRepository.save(category);
        return mapToDTO(saved);
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryCreateUpdateDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setTitle(dto.getTitle().trim());
        category.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : "");
        category.setDifficulty(dto.getDifficulty().trim());
        category.setTimerMinutes(dto.getTimerMinutes());

        Category updated = categoryRepository.save(category);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    public CategoryDTO mapToDTO(Category category) {
        long qCount = questionRepository.countByCategoryId(category.getId());
        return new CategoryDTO(
                category.getId(),
                category.getTitle(),
                category.getDescription(),
                category.getDifficulty(),
                category.getTimerMinutes(),
                qCount
        );
    }
}
