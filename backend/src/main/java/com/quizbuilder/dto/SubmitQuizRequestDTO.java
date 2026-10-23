package com.quizbuilder.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class SubmitQuizRequestDTO {

    @NotNull(message = "Attempt ID is required")
    private Long attemptId;

    private List<QuestionAnswerInputDTO> answers;

    public SubmitQuizRequestDTO() {}

    public SubmitQuizRequestDTO(Long attemptId, List<QuestionAnswerInputDTO> answers) {
        this.attemptId = attemptId;
        this.answers = answers;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public List<QuestionAnswerInputDTO> getAnswers() {
        return answers;
    }

    public void setAnswers(List<QuestionAnswerInputDTO> answers) {
        this.answers = answers;
    }
}
