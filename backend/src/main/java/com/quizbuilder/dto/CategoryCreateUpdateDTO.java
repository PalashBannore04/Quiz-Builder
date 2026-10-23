package com.quizbuilder.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CategoryCreateUpdateDTO {

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    private String description;

    @NotBlank(message = "Difficulty is required")
    private String difficulty = "Medium"; // Easy, Medium, Hard

    @NotNull(message = "Timer in minutes is required")
    @Min(value = 1, message = "Timer must be at least 1 minute")
    private Integer timerMinutes = 10;

    public CategoryCreateUpdateDTO() {}

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
}
