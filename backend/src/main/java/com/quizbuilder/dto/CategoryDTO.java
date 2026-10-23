package com.quizbuilder.dto;

public class CategoryDTO {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private Integer timerMinutes;
    private long questionCount;

    public CategoryDTO() {}

    public CategoryDTO(Long id, String title, String description, String difficulty, Integer timerMinutes, long questionCount) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.timerMinutes = timerMinutes;
        this.questionCount = questionCount;
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
}
