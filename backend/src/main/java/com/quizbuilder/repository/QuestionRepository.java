package com.quizbuilder.repository;

import com.quizbuilder.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategoryIdOrderByIdAsc(Long categoryId);
    long countByCategoryId(Long categoryId);
}
