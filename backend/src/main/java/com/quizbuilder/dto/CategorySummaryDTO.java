package com.quizbuilder.dto;

public class CategorySummaryDTO {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private Integer timerMinutes;
    private long questionCount;
    private int attemptsUsed; // 0, 1, 2
    private int maxAttempts = 2;
    private boolean isLocked; // true if attemptsUsed >= 2
    private Integer baselineScore;
    private Integer retakeScore;
    private Integer highestScore;
    private Long lastAttemptId;

    public CategorySummaryDTO() {}

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getTimerMinutes() {
        return timerMinutes;
    }

    public void setTimerMinutes(Integer timerMinutes) {
        this.timerMinutes = timerMinutes;
    }

    public long getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(long questionCount) {
        this.questionCount = questionCount;
    }

    public int getAttemptsUsed() {
        return attemptsUsed;
    }

    public void setAttemptsUsed(int attemptsUsed) {
        this.attemptsUsed = attemptsUsed;
    }

    public int getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(int maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void setLocked(boolean locked) {
        isLocked = locked;
    }

    public Integer getBaselineScore() {
        return baselineScore;
    }

    public void setBaselineScore(Integer baselineScore) {
        this.baselineScore = baselineScore;
    }

    public Integer getRetakeScore() {
        return retakeScore;
    }

    public void setRetakeScore(Integer retakeScore) {
        this.retakeScore = retakeScore;
    }

    public Integer getHighestScore() {
        return highestScore;
    }

    public void setHighestScore(Integer highestScore) {
        this.highestScore = highestScore;
    }

    public Long getLastAttemptId() {
        return lastAttemptId;
    }

    public void setLastAttemptId(Long lastAttemptId) {
        this.lastAttemptId = lastAttemptId;
    }
}
