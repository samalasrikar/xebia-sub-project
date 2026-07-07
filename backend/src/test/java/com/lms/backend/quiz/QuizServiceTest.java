package com.lms.backend.quiz;

import com.lms.backend.quiz.dto.QuizSubmitRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SuppressWarnings("null")
public class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuizAttemptRepository quizAttemptRepository;

    @InjectMocks
    private QuizService quizService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSubmitQuizAttempt_PassVerdict() {
        // Arrange
        Quiz quiz = new Quiz();
        quiz.setId("quiz-1");
        quiz.setName("React State Management");
        quiz.setPassingMarks(2);
        
        List<QuizQuestion> questions = new ArrayList<>();
        questions.add(new QuizQuestion("Q1", "A", "B", "C", "D", "B"));
        questions.add(new QuizQuestion("Q2", "A", "B", "C", "D", "B"));
        questions.add(new QuizQuestion("Q3", "A", "B", "C", "D", "A"));
        quiz.setQuestions(questions);

        when(quizRepository.findById("quiz-1")).thenReturn(Optional.of(quiz));

        QuizSubmitRequest request = new QuizSubmitRequest();
        request.setStudentId("s4");
        request.setStudentName("Jane Doe");
        request.setTimeTaken("5 mins");

        QuizSubmitRequest.AnswerSubmission ans1 = new QuizSubmitRequest.AnswerSubmission();
        ans1.setQuestion("Q1");
        ans1.setStudentAnswer("B"); // Correct

        QuizSubmitRequest.AnswerSubmission ans2 = new QuizSubmitRequest.AnswerSubmission();
        ans2.setQuestion("Q2");
        ans2.setStudentAnswer("B"); // Correct

        QuizSubmitRequest.AnswerSubmission ans3 = new QuizSubmitRequest.AnswerSubmission();
        ans3.setQuestion("Q3");
        ans3.setStudentAnswer("B"); // Incorrect (correct is A)

        List<QuizSubmitRequest.AnswerSubmission> answers = Arrays.asList(ans1, ans2, ans3);
        request.setAnswers(answers);

        when(quizAttemptRepository.findByQuizIdAndStudentId("quiz-1", "s4")).thenReturn(Optional.empty());
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenAnswer(invocation -> (QuizAttempt) invocation.getArgument(0));

        // Act
        QuizAttempt result = quizService.submitQuizAttempt("quiz-1", request);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getScore());
        assertEquals(67, result.getPercentage());
        assertEquals("Pass", result.getStatus());
        verify(quizAttemptRepository, times(1)).save(any(QuizAttempt.class));
    }

    @Test
    public void testSubmitQuizAttempt_FailVerdict() {
        // Arrange
        Quiz quiz = new Quiz();
        quiz.setId("quiz-1");
        quiz.setName("React State Management");
        quiz.setPassingMarks(2);
        
        List<QuizQuestion> questions = new ArrayList<>();
        questions.add(new QuizQuestion("Q1", "A", "B", "C", "D", "B"));
        questions.add(new QuizQuestion("Q2", "A", "B", "C", "D", "B"));
        quiz.setQuestions(questions);

        when(quizRepository.findById("quiz-1")).thenReturn(Optional.of(quiz));

        QuizSubmitRequest request = new QuizSubmitRequest();
        request.setStudentId("s4");
        request.setAnswers(new ArrayList<>()); // 0 correct answers

        when(quizAttemptRepository.findByQuizIdAndStudentId("quiz-1", "s4")).thenReturn(Optional.empty());
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenAnswer(invocation -> (QuizAttempt) invocation.getArgument(0));

        // Act
        QuizAttempt result = quizService.submitQuizAttempt("quiz-1", request);

        // Assert
        assertEquals(0, result.getScore());
        assertEquals(0, result.getPercentage());
        assertEquals("Fail", result.getStatus());
    }

    @Test
    public void testCreateQuiz_ValidationRequiredName() {
        Quiz quiz = new Quiz();
        quiz.setName(""); // Empty name
        
        assertThrows(IllegalArgumentException.class, () -> {
            quizService.createQuiz(quiz);
        });
    }

    @Test
    public void testCreateQuiz_ValidationPublishNoQuestions() {
        Quiz quiz = new Quiz();
        quiz.setName("Vite Configuration");
        quiz.setStatus("Published");
        quiz.setQuestions(new ArrayList<>()); // Empty questions list
        
        assertThrows(IllegalArgumentException.class, () -> {
            quizService.createQuiz(quiz);
        });
    }
}
