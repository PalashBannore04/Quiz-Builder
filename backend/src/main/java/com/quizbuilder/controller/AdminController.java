package com.quizbuilder.controller;

import com.quizbuilder.dto.*;
import com.quizbuilder.service.AdminService;
import com.quizbuilder.service.SeedDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final SeedDataService seedDataService;

    public AdminController(AdminService adminService, SeedDataService seedDataService) {
        this.adminService = adminService;
        this.seedDataService = seedDataService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/submissions")
    public ResponseEntity<List<AdminSubmissionTrackerDTO>> getSubmissionTrackers() {
        return ResponseEntity.ok(adminService.getSubmissionTrackers());
    }

    @GetMapping("/candidates")
    public ResponseEntity<List<AdminCandidateSummaryDTO>> getCandidateSummaries() {
        return ResponseEntity.ok(adminService.getCandidateSummaries());
    }

    @GetMapping("/domains/performance")
    public ResponseEntity<List<AdminDomainPerformanceDTO>> getDomainPerformances() {
        return ResponseEntity.ok(adminService.getDomainPerformances());
    }

    @GetMapping("/attempts/{attemptId}/audit")
    public ResponseEntity<AttemptResultDTO> getAttemptAudit(@PathVariable Long attemptId) {
        return ResponseEntity.ok(adminService.getAttemptAudit(attemptId));
    }

    @PostMapping("/reset-seed")
    public ResponseEntity<ApiResponse> resetSeedData() {
        seedDataService.resetSeedData();
        return ResponseEntity.ok(new ApiResponse(true, "Database seed data reset successfully with default categories and questions."));
    }
}
