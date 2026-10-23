package com.quizbuilder.service;

import com.quizbuilder.dto.*;
import com.quizbuilder.entity.Attempt;
import com.quizbuilder.entity.Category;
import com.quizbuilder.entity.User;
import com.quizbuilder.exception.ResourceNotFoundException;
import com.quizbuilder.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final AttemptRepository attemptRepository;
    private final AttemptService attemptService;

    public AdminService(CategoryRepository categoryRepository,
                        QuestionRepository questionRepository,
                        UserRepository userRepository,
                        AttemptRepository attemptRepository,
                        AttemptService attemptService) {
        this.categoryRepository = categoryRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.attemptRepository = attemptRepository;
        this.attemptService = attemptService;
    }

    public AdminDashboardStatsDTO getDashboardStats() {
        long totalDomains = categoryRepository.count();
        long activeQuestions = questionRepository.count();
        long registeredStudents = userRepository.countByRole("ROLE_USER");
        long attemptsEvaluated = attemptRepository.countByStatus("COMPLETED") + attemptRepository.countByStatus("TIMED_OUT");

        return new AdminDashboardStatsDTO(totalDomains, activeQuestions, registeredStudents, attemptsEvaluated);
    }

    public List<AdminSubmissionTrackerDTO> getSubmissionTrackers() {
        List<Attempt> allAttempts = attemptRepository.findAllByOrderByStartedAtDesc();
        // Group by user_id + category_id to identify latest attempt vs previous attempt
        Map<String, List<Attempt>> grouped = new LinkedHashMap<>();
        for (Attempt a : allAttempts) {
            String key = a.getUser().getId() + "-" + a.getCategory().getId();
            grouped.computeIfAbsent(key, k -> new ArrayList<>()).add(a);
        }

        List<AdminSubmissionTrackerDTO> trackers = new ArrayList<>();

        for (Map.Entry<String, List<Attempt>> entry : grouped.entrySet()) {
            List<Attempt> attemptsList = entry.getValue();
            // Sort ascending by attempt number so [0] is attempt 1, [1] is attempt 2
            attemptsList.sort(Comparator.comparingInt(Attempt::getAttemptNumber));

            Attempt attempt1 = attemptsList.size() >= 1 ? attemptsList.get(0) : null;
            Attempt attempt2 = attemptsList.size() >= 2 ? attemptsList.get(1) : null;
            Attempt latestAttempt = attemptsList.get(attemptsList.size() - 1);

            AdminSubmissionTrackerDTO tracker = new AdminSubmissionTrackerDTO();
            tracker.setAttemptId(latestAttempt.getId());
            tracker.setUserId(latestAttempt.getUser().getId());
            tracker.setCandidateName(latestAttempt.getUser().getName());
            tracker.setCandidateEmail(latestAttempt.getUser().getEmail());
            tracker.setCategoryId(latestAttempt.getCategory().getId());
            tracker.setDomainTitle(latestAttempt.getCategory().getTitle());
            tracker.setAttemptQuota(attemptsList.size() + "/2");
            tracker.setSubmittedAt(latestAttempt.getSubmittedAt() != null ? latestAttempt.getSubmittedAt() : latestAttempt.getStartedAt());

            if (attempt1 != null && attempt2 != null) {
                // Both attempts taken: calculate Delta
                tracker.setPreviousScore(attempt1.getScore());
                tracker.setPreviousTotal(attempt1.getTotal());
                tracker.setPreviousAttemptDisplay(attempt1.getScore() + "/" + attempt1.getTotal());

                tracker.setLatestScore(attempt2.getScore());
                tracker.setLatestTotal(attempt2.getTotal());
                tracker.setLatestAttemptDisplay(attempt2.getScore() + "/" + attempt2.getTotal());

                int delta = attempt2.getScore() - attempt1.getScore();
                tracker.setScoreDelta(delta);
                if (delta > 0) {
                    tracker.setScoreDeltaDisplay("+" + delta);
                } else if (delta == 0) {
                    tracker.setScoreDeltaDisplay("0 (No change)");
                } else {
                    tracker.setScoreDeltaDisplay(String.valueOf(delta));
                }
            } else if (attempt1 != null) {
                // Only baseline attempt taken so far
                tracker.setPreviousScore(null);
                tracker.setPreviousTotal(null);
                tracker.setPreviousAttemptDisplay("-");

                tracker.setLatestScore(attempt1.getScore());
                tracker.setLatestTotal(attempt1.getTotal());
                tracker.setLatestAttemptDisplay(attempt1.getScore() + "/" + attempt1.getTotal());

                tracker.setScoreDelta(null);
                tracker.setScoreDeltaDisplay("Baseline (Attempt 1)");
            }

            trackers.add(tracker);
        }

        return trackers;
    }

    public List<AdminCandidateSummaryDTO> getCandidateSummaries() {
        List<User> students = userRepository.findByRoleOrderByCreatedAtDesc("ROLE_USER");
        return students.stream()
                .map(s -> {
                    long attemptsCount = attemptRepository.findByUserIdOrderByStartedAtDesc(s.getId()).size();
                    Double avg = attemptRepository.calculateAverageScoreByUserId(s.getId());
                    Double roundedAvg = avg != null ? Math.round(avg * 10.0) / 10.0 : null;

                    return new AdminCandidateSummaryDTO(
                            s.getId(),
                            s.getName(),
                            s.getEmail(),
                            attemptsCount,
                            roundedAvg,
                            s.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
    }

    public List<AdminDomainPerformanceDTO> getDomainPerformances() {
        List<Category> categories = categoryRepository.findAllByOrderByTitleAsc();
        return categories.stream()
                .map(c -> {
                    long qCount = questionRepository.countByCategoryId(c.getId());
                    List<Attempt> attempts = attemptRepository.findByCategoryId(c.getId());
                    long submissionsCount = attempts.stream()
                            .filter(a -> "COMPLETED".equals(a.getStatus()) || "TIMED_OUT".equals(a.getStatus()))
                            .count();
                    Double avg = attemptRepository.calculateAverageScoreByCategoryId(c.getId());
                    Double roundedAvg = avg != null ? Math.round(avg * 10.0) / 10.0 : null;

                    return new AdminDomainPerformanceDTO(
                            c.getId(),
                            c.getTitle(),
                            c.getDifficulty(),
                            qCount,
                            submissionsCount,
                            roundedAvg
                    );
                })
                .collect(Collectors.toList());
    }

    public AttemptResultDTO getAttemptAudit(Long attemptId) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + attemptId));

        return attemptService.getAttemptResult(attemptId, attempt.getUser().getEmail());
    }
}
