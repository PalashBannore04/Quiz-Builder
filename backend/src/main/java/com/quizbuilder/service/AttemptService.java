package com.quizbuilder.service;

import com.quizbuilder.dto.*;
import com.quizbuilder.entity.*;
import com.quizbuilder.exception.AttemptLimitExceededException;
import com.quizbuilder.exception.BadRequestException;
import com.quizbuilder.exception.ResourceNotFoundException;
import com.quizbuilder.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AttemptService {

    private final AttemptRepository attemptRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;
    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    public AttemptService(AttemptRepository attemptRepository,
                          AttemptAnswerRepository attemptAnswerRepository,
                          CategoryRepository categoryRepository,
                          QuestionRepository questionRepository,
                          UserRepository userRepository) {
        this.attemptRepository = attemptRepository;
        this.attemptAnswerRepository = attemptAnswerRepository;
        this.categoryRepository = categoryRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public StartQuizResponseDTO startQuiz(Long categoryId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        // Enforce maximum 2 attempts per quiz category
        long previousAttemptsCount = attemptRepository.countByUserIdAndCategoryId(user.getId(), categoryId);
        if (previousAttemptsCount >= 2) {
            throw new AttemptLimitExceededException(
                    "You have reached the maximum allowed attempts (2/2) for '" + category.getTitle() + "'. Attempt limit enforced."
            );
        }

        List<Question> questions = questionRepository.findByCategoryIdOrderByIdAsc(categoryId);
        if (questions.isEmpty()) {
            throw new BadRequestException("No questions available in category '" + category.getTitle() + "'");
        }

        int attemptNumber = (int) previousAttemptsCount + 1;

        Attempt attempt = new Attempt();
        attempt.setUser(user);
        attempt.setCategory(category);
        attempt.setAttemptNumber(attemptNumber);
        attempt.setTotal(questions.size());
        attempt.setScore(0);
        attempt.setStartedAt(LocalDateTime.now());
        attempt.setStatus("IN_PROGRESS");

        Attempt savedAttempt = attemptRepository.save(attempt);

        StartQuizResponseDTO response = new StartQuizResponseDTO();
        response.setAttemptId(savedAttempt.getId());
        response.setCategoryId(category.getId());
        response.setCategoryTitle(category.getTitle());
        response.setDifficulty(category.getDifficulty());
        response.setTimerMinutes(category.getTimerMinutes());
        response.setAttemptNumber(attemptNumber);
        response.setStartedAt(savedAttempt.getStartedAt());

        // Strictly omit correct answers & explanations from candidate payload
        List<QuestionDTO> candidateQuestions = questions.stream()
                .map(q -> new QuestionDTO(
                        q.getId(),
                        category.getId(),
                        q.getText(),
                        q.getOptionA(),
                        q.getOptionB(),
                        q.getOptionC(),
                        q.getOptionD()
                ))
                .collect(Collectors.toList());

        response.setQuestions(candidateQuestions);
        return response;
    }

    @Transactional
    public AttemptResultDTO submitQuiz(SubmitQuizRequestDTO request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Attempt attempt = attemptRepository.findById(request.getAttemptId())
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + request.getAttemptId()));

        if (!attempt.getUser().getId().equals(user.getId()) && !"ROLE_ADMIN".equals(user.getRole())) {
            throw new BadRequestException("You do not own this quiz attempt.");
        }

        if ("COMPLETED".equals(attempt.getStatus())) {
            return getAttemptResult(attempt.getId(), userEmail);
        }

        LocalDateTime now = LocalDateTime.now();
        Category category = attempt.getCategory();

        // Server-side validation of time limit (category timer + 30 seconds network buffer)
        long allowedSeconds = (category.getTimerMinutes() * 60L) + 30L;
        long elapsedSeconds = Duration.between(attempt.getStartedAt(), now).getSeconds();

        String finalStatus = "COMPLETED";
        if (elapsedSeconds > allowedSeconds) {
            finalStatus = "TIMED_OUT";
        }

        List<Question> questions = questionRepository.findByCategoryIdOrderByIdAsc(category.getId());
        Map<Long, String> userAnswersMap = new HashMap<>();
        if (request.getAnswers() != null) {
            for (QuestionAnswerInputDTO a : request.getAnswers()) {
                if (a.getQuestionId() != null) {
                    userAnswersMap.put(a.getQuestionId(), a.getSelectedOption());
                }
            }
        }

        int score = 0;
        List<AttemptAnswer> answersToSave = new ArrayList<>();

        for (Question question : questions) {
            String selected = userAnswersMap.get(question.getId());
            boolean isCorrect = false;
            if (selected != null && !selected.isBlank()) {
                selected = selected.trim().toUpperCase();
                if (selected.equalsIgnoreCase(question.getCorrectOption().trim())) {
                    isCorrect = true;
                    score++;
                }
            } else {
                selected = null;
            }

            AttemptAnswer answer = new AttemptAnswer();
            answer.setAttempt(attempt);
            answer.setQuestion(question);
            answer.setSelectedOption(selected);
            answer.setIsCorrect(isCorrect);
            answersToSave.add(answer);
        }

        attempt.setScore(score);
        attempt.setTotal(questions.size());
        attempt.setSubmittedAt(now);
        attempt.setStatus(finalStatus);

        attemptRepository.save(attempt);
        attemptAnswerRepository.saveAll(answersToSave);

        return buildResultDTO(attempt, answersToSave);
    }

    public AttemptResultDTO getAttemptResult(Long attemptId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + attemptId));

        if (!attempt.getUser().getId().equals(user.getId()) && !"ROLE_ADMIN".equals(user.getRole())) {
            throw new BadRequestException("Unauthorized to view this attempt result.");
        }

        List<AttemptAnswer> answers = attemptAnswerRepository.findByAttemptIdOrderByIdAsc(attemptId);
        return buildResultDTO(attempt, answers);
    }

    public List<AttemptHistoryDTO> getUserHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        List<Attempt> attempts = attemptRepository.findByUserIdOrderByStartedAtDesc(user.getId());
        return attempts.stream()
                .map(a -> {
                    AttemptHistoryDTO dto = new AttemptHistoryDTO();
                    dto.setAttemptId(a.getId());
                    dto.setCategoryId(a.getCategory().getId());
                    dto.setCategoryTitle(a.getCategory().getTitle());
                    dto.setDifficulty(a.getCategory().getDifficulty());
                    dto.setAttemptNumber(a.getAttemptNumber());
                    dto.setScore(a.getScore());
                    dto.setTotal(a.getTotal());
                    double pct = a.getTotal() > 0 ? (a.getScore() * 100.0) / a.getTotal() : 0.0;
                    dto.setPercentage(Math.round(pct * 10.0) / 10.0);
                    dto.setStatus(a.getStatus());
                    dto.setStartedAt(a.getStartedAt());
                    dto.setSubmittedAt(a.getSubmittedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private AttemptResultDTO buildResultDTO(Attempt attempt, List<AttemptAnswer> answers) {
        AttemptResultDTO dto = new AttemptResultDTO();
        dto.setAttemptId(attempt.getId());
        dto.setCategoryId(attempt.getCategory().getId());
        dto.setCategoryTitle(attempt.getCategory().getTitle());
        dto.setDifficulty(attempt.getCategory().getDifficulty());
        dto.setAttemptNumber(attempt.getAttemptNumber());
        dto.setScore(attempt.getScore());
        dto.setTotal(attempt.getTotal());
        double pct = attempt.getTotal() > 0 ? (attempt.getScore() * 100.0) / attempt.getTotal() : 0.0;
        dto.setPercentage(Math.round(pct * 10.0) / 10.0);
        dto.setStatus(attempt.getStatus());
        dto.setStartedAt(attempt.getStartedAt());
        dto.setSubmittedAt(attempt.getSubmittedAt());

        if (attempt.getStartedAt() != null && attempt.getSubmittedAt() != null) {
            dto.setDurationSeconds(Duration.between(attempt.getStartedAt(), attempt.getSubmittedAt()).getSeconds());
        }

        List<AttemptAnswerReviewDTO> reviewList = answers.stream()
                .map(ans -> {
                    Question q = ans.getQuestion();
                    AttemptAnswerReviewDTO r = new AttemptAnswerReviewDTO();
                    r.setQuestionId(q.getId());
                    r.setQuestionText(q.getText());
                    r.setOptionA(q.getOptionA());
                    r.setOptionB(q.getOptionB());
                    r.setOptionC(q.getOptionC());
                    r.setOptionD(q.getOptionD());
                    r.setSelectedOption(ans.getSelectedOption());
                    r.setCorrectOption(q.getCorrectOption());
                    r.setIsCorrect(ans.getIsCorrect());
                    r.setExplanation(q.getExplanation());
                    return r;
                })
                .collect(Collectors.toList());

        dto.setAnswers(reviewList);
        return dto;
    }
}
