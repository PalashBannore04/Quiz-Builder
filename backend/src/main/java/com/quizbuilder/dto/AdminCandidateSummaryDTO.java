package com.quizbuilder.dto;

import java.time.LocalDateTime;

public class AdminCandidateSummaryDTO {
    private Long id;
    private String name;
    private String email;
    private long attemptsCount;
    private Double averageScore;
    private LocalDateTime joinDate;

    public AdminCandidateSummaryDTO() {}

    public AdminCandidateSummaryDTO(Long id, String name, String email, long attemptsCount, Double averageScore, LocalDateTime joinDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.attemptsCount = attemptsCount;
        this.averageScore = averageScore;
        this.joinDate = joinDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getAttemptsCount() {
        return attemptsCount;
    }

    public void setAttemptsCount(long attemptsCount) {
        this.attemptsCount = attemptsCount;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public LocalDateTime getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDateTime joinDate) {
        this.joinDate = joinDate;
    }
}
