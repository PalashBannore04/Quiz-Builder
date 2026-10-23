package com.quizbuilder.service;

import com.quizbuilder.dto.QuestionAdminDTO;
import com.quizbuilder.dto.QuestionCreateUpdateDTO;
import com.quizbuilder.dto.QuestionDTO;
import com.quizbuilder.entity.Category;
import com.quizbuilder.entity.Question;
import com.quizbuilder.exception.ResourceNotFoundException;
import com.quizbuilder.repository.CategoryRepository;
import com.quizbuilder.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final CategoryRepository categoryRepository;

    public QuestionService(QuestionRepository questionRepository, CategoryRepository categoryRepository) {
        this.questionRepository = questionRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * Used for quiz room: strictly omits correctOption and explanation so client cannot inspect network tab to cheat.
     */
    public List<QuestionDTO> getQuestionsForCandidate(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found with id: " + categoryId);
        }

        return questionRepository.findByCategoryIdOrderByIdAsc(categoryId).stream()
                .map(q -> new QuestionDTO(
                        q.getId(),
                        q.getCategory().getId(),
                        q.getText(),
                        q.getOptionA(),
                        q.getOptionB(),
                        q.getOptionC(),
                        q.getOptionD()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Used for Admin Question Bank Management.
     */
    public List<QuestionAdminDTO> getQuestionsForAdmin(Long categoryId) {
        List<Question> questions;
        if (categoryId != null && categoryId > 0) {
            questions = questionRepository.findByCategoryIdOrderByIdAsc(categoryId);
        } else {
            questions = questionRepository.findAll();
        }

        return questions.stream()
                .map(this::mapToAdminDTO)
                .collect(Collectors.toList());
    }

    public QuestionAdminDTO getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        return mapToAdminDTO(question);
    }

    @Transactional
    public QuestionAdminDTO createQuestion(QuestionCreateUpdateDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Question question = new Question();
        question.setCategory(category);
        question.setText(dto.getText().trim());
        question.setOptionA(dto.getOptionA().trim());
        question.setOptionB(dto.getOptionB().trim());
        question.setOptionC(dto.getOptionC().trim());
        question.setOptionD(dto.getOptionD().trim());
        question.setCorrectOption(dto.getCorrectOption().trim().toUpperCase());
        question.setExplanation(dto.getExplanation().trim());

        Question saved = questionRepository.save(question);
        return mapToAdminDTO(saved);
    }

    @Transactional
    public QuestionAdminDTO updateQuestion(Long id, QuestionCreateUpdateDTO dto) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        question.setCategory(category);
        question.setText(dto.getText().trim());
        question.setOptionA(dto.getOptionA().trim());
        question.setOptionB(dto.getOptionB().trim());
        question.setOptionC(dto.getOptionC().trim());
        question.setOptionD(dto.getOptionD().trim());
        question.setCorrectOption(dto.getCorrectOption().trim().toUpperCase());
        question.setExplanation(dto.getExplanation().trim());

        Question updated = questionRepository.save(question);
        return mapToAdminDTO(updated);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Question not found with id: " + id);
        }
        questionRepository.deleteById(id);
    }

    private QuestionAdminDTO mapToAdminDTO(Question q) {
        QuestionAdminDTO dto = new QuestionAdminDTO();
        dto.setId(q.getId());
        dto.setCategoryId(q.getCategory().getId());
        dto.setCategoryTitle(q.getCategory().getTitle());
        dto.setText(q.getText());
        dto.setOptionA(q.getOptionA());
        dto.setOptionB(q.getOptionB());
        dto.setOptionC(q.getOptionC());
        dto.setOptionD(q.getOptionD());
        dto.setCorrectOption(q.getCorrectOption());
        dto.setExplanation(q.getExplanation());
        return dto;
    }
}
