package com.quizbuilder.repository;

import com.quizbuilder.entity.AttemptAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttemptAnswerRepository extends JpaRepository<AttemptAnswer, Long> {
    List<AttemptAnswer> findByAttemptIdOrderByIdAsc(Long attemptId);
    void deleteByAttemptId(Long attemptId);
}
