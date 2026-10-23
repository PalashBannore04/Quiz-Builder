package com.quizbuilder.repository;

import com.quizbuilder.entity.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    
    List<Attempt> findByUserIdOrderByStartedAtDesc(Long userId);

    List<Attempt> findByUserIdAndCategoryIdOrderByAttemptNumberAsc(Long userId, Long categoryId);

    long countByUserIdAndCategoryId(Long userId, Long categoryId);

    Optional<Attempt> findTopByUserIdAndCategoryIdOrderByAttemptNumberDesc(Long userId, Long categoryId);

    List<Attempt> findAllByOrderByStartedAtDesc();

    List<Attempt> findByCategoryId(Long categoryId);

    long countByStatus(String status);

    @Query("SELECT AVG(a.score * 100.0 / a.total) FROM Attempt a WHERE a.user.id = :userId AND a.status = 'COMPLETED' AND a.total > 0")
    Double calculateAverageScoreByUserId(@Param("userId") Long userId);

    @Query("SELECT AVG(a.score * 100.0 / a.total) FROM Attempt a WHERE a.category.id = :categoryId AND a.status = 'COMPLETED' AND a.total > 0")
    Double calculateAverageScoreByCategoryId(@Param("categoryId") Long categoryId);
}
