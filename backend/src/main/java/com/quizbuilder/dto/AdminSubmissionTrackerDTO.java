package com.quizbuilder.dto;

import java.time.LocalDateTime;

public class AdminSubmissionTrackerDTO {
    private Long attemptId;
    private Long userId;
    private String candidateName;
    private String candidateEmail;
    private Long categoryId;
    private String domainTitle;
    private String attemptQuota; // e.g. "1/2" or "2/2"
    private Integer previousScore;
    private Integer previousTotal;
    private String previousAttemptDisplay; // e.g. "3/5" or "-"
    private Integer latestScore;
    private Integer latestTotal;
    private String latestAttemptDisplay; // e.g. "5/5"
    private Integer scoreDelta; // latestScore - previousScore (or null if baseline only)
    private String scoreDeltaDisplay; // e.g. "+2" or "-1" or "Baseline"
    private LocalDateTime submittedAt;

    public AdminSubmissionTrackerDTO() {}

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getDomainTitle() {
        return domainTitle;
    }

    public void setDomainTitle(String domainTitle) {
        this.domainTitle = domainTitle;
    }

    public String getAttemptQuota() {
        return attemptQuota;
    }

    public void setAttemptQuota(String attemptQuota) {
        this.attemptQuota = attemptQuota;
    }

    public Integer getPreviousScore() {
        return previousScore;
    }

    public void setPreviousScore(Integer previousScore) {
        this.previousScore = previousScore;
    }

    public Integer getPreviousTotal() {
        return previousTotal;
    }

    public void setPreviousTotal(Integer previousTotal) {
        this.previousTotal = previousTotal;
    }

    public String getPreviousAttemptDisplay() {
        return previousAttemptDisplay;
    }

    public void setPreviousAttemptDisplay(String previousAttemptDisplay) {
        this.previousAttemptDisplay = previousAttemptDisplay;
    }

    public Integer getLatestScore() {
        return latestScore;
    }

    public void setLatestScore(Integer latestScore) {
        this.latestScore = latestScore;
    }

    public Integer getLatestTotal() {
        return latestTotal;
    }

    public void setLatestTotal(Integer latestTotal) {
        this.latestTotal = latestTotal;
    }

    public String getLatestAttemptDisplay() {
        return latestAttemptDisplay;
    }

    public void setLatestAttemptDisplay(String latestAttemptDisplay) {
        this.latestAttemptDisplay = latestAttemptDisplay;
    }

    public Integer getScoreDelta() {
        return scoreDelta;
    }

    public void setScoreDelta(Integer scoreDelta) {
        this.scoreDelta = scoreDelta;
    }

    public String getScoreDeltaDisplay() {
        return scoreDeltaDisplay;
    }

    public void setScoreDeltaDisplay(String scoreDeltaDisplay) {
        this.scoreDeltaDisplay = scoreDeltaDisplay;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
