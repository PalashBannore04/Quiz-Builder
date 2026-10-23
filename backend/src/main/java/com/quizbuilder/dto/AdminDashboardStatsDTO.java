package com.quizbuilder.dto;

public class AdminDashboardStatsDTO {
    private long totalDomains;
    private long activeQuestions;
    private long registeredStudents;
    private long attemptsEvaluated;

    public AdminDashboardStatsDTO() {}

    public AdminDashboardStatsDTO(long totalDomains, long activeQuestions, long registeredStudents, long attemptsEvaluated) {
        this.totalDomains = totalDomains;
        this.activeQuestions = activeQuestions;
        this.registeredStudents = registeredStudents;
        this.attemptsEvaluated = attemptsEvaluated;
    }

    public long getTotalDomains() {
        return totalDomains;
    }

    public void setTotalDomains(long totalDomains) {
        this.totalDomains = totalDomains;
    }

    public long getActiveQuestions() {
        return activeQuestions;
    }

    public void setActiveQuestions(long activeQuestions) {
        this.activeQuestions = activeQuestions;
    }

    public long getRegisteredStudents() {
        return registeredStudents;
    }

    public void setRegisteredStudents(long registeredStudents) {
        this.registeredStudents = registeredStudents;
    }

    public long getAttemptsEvaluated() {
        return attemptsEvaluated;
    }

    public void setAttemptsEvaluated(long attemptsEvaluated) {
        this.attemptsEvaluated = attemptsEvaluated;
    }
}
