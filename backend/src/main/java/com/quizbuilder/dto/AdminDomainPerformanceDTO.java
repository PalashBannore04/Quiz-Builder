package com.quizbuilder.dto;

public class AdminDomainPerformanceDTO {
    private Long id;
    private String title;
    private String difficulty;
    private long questionCount;
    private long submissionCount;
    private Double averageScore;

    public AdminDomainPerformanceDTO() {}

    public AdminDomainPerformanceDTO(Long id, String title, String difficulty, long questionCount, long submissionCount, Double averageScore) {
        this.id = id;
        this.title = title;
        this.difficulty = difficulty;
        this.questionCount = questionCount;
        this.submissionCount = submissionCount;
        this.averageScore = averageScore;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public long getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(long questionCount) {
        this.questionCount = questionCount;
    }

    public long getSubmissionCount() {
        return submissionCount;
    }

    public void setSubmissionCount(long submissionCount) {
        this.submissionCount = submissionCount;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }
}
