package com.quizbuilder.controller;

import com.quizbuilder.dto.ApiResponse;
import com.quizbuilder.dto.QuestionAdminDTO;
import com.quizbuilder.dto.QuestionCreateUpdateDTO;
import com.quizbuilder.dto.QuestionDTO;
import com.quizbuilder.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    /**
     * Endpoint for candidate during quiz room:
     * Never returns correct answers or explanations!
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsForCandidate(@PathVariable Long categoryId) {
        return ResponseEntity.ok(questionService.getQuestionsForCandidate(categoryId));
    }

    /**
     * Admin endpoints for full Question Bank CRUD
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QuestionAdminDTO>> getQuestionsForAdmin(
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(questionService.getQuestionsForAdmin(categoryId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionAdminDTO> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionAdminDTO> createQuestion(@Valid @RequestBody QuestionCreateUpdateDTO dto) {
        QuestionAdminDTO created = questionService.createQuestion(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionAdminDTO> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody QuestionCreateUpdateDTO dto) {
        QuestionAdminDTO updated = questionService.updateQuestion(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok(new ApiResponse(true, "Question deleted successfully"));
    }
}
