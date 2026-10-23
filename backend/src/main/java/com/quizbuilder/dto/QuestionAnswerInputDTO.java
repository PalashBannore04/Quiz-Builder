package com.quizbuilder.dto;

import jakarta.validation.constraints.NotNull;

public class QuestionAnswerInputDTO {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    private String selectedOption; // A, B, C, D or null

    public QuestionAnswerInputDTO() {}

    public QuestionAnswerInputDTO(Long questionId, String selectedOption) {
        this.questionId = questionId;
        this.selectedOption = selectedOption;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }
}
