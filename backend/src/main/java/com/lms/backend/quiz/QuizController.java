package com.lms.backend.quiz;

import com.lms.backend.common.ApiResponse;
import com.lms.backend.quiz.dto.QuizQuestionDto;
import com.lms.backend.quiz.dto.QuizSubmitRequest;
import com.lms.backend.quiz.dto.QuizStatsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping
    public ApiResponse<List<Quiz>> getAllQuizzes(@RequestParam(required = false) String studentId) {
        if (studentId != null && !studentId.trim().isEmpty()) {
            return new ApiResponse<>(quizService.getQuizzesForStudent(studentId));
        }
        return new ApiResponse<>(quizService.getAllQuizzes());
    }

    @GetMapping("/stats")
    public ApiResponse<QuizStatsDto> getQuizStats() {
        return new ApiResponse<>(quizService.getQuizStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Quiz>> getQuizById(@PathVariable String id) {
        return quizService.getQuizById(id)
                .map(quiz -> ResponseEntity.ok(new ApiResponse<>(quiz)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<ApiResponse<List<QuizQuestionDto>>> getQuizQuestionsForStudent(@PathVariable String id) {
        return quizService.getQuizById(id)
                .map(quiz -> {
                    List<QuizQuestionDto> questions = quiz.getQuestions().stream()
                            .map(QuizQuestionDto::fromEntity)
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(new ApiResponse<>(questions));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody Quiz quiz) {
        try {
            Quiz created = quizService.createQuiz(quiz);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(created));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuiz(@PathVariable String id, @RequestBody Quiz quiz) {
        try {
            return quizService.updateQuiz(id, quiz)
                    .map(updated -> ResponseEntity.ok(new ApiResponse<>(updated)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> deleteQuiz(@PathVariable String id) {
        boolean deleted = quizService.deleteQuiz(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse<>(true));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<QuizAttempt>> submitQuiz(@PathVariable String id, @RequestBody QuizSubmitRequest request) {
        try {
            QuizAttempt attempt = quizService.submitQuizAttempt(id, request);
            return ResponseEntity.ok(new ApiResponse<>(attempt));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/result")
    public ResponseEntity<ApiResponse<QuizAttempt>> getStudentResult(@PathVariable String id, @RequestParam String studentId) {
        return quizService.getStudentResultForQuiz(id, studentId)
                .map(attempt -> ResponseEntity.ok(new ApiResponse<>(attempt)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/results")
    public ApiResponse<List<QuizAttempt>> getQuizResults(@PathVariable String id) {
        return new ApiResponse<>(quizService.getQuizResults(id));
    }

    @PostMapping("/{id}/import")
    public ResponseEntity<ApiResponse<Quiz>> importQuestions(@PathVariable String id, @RequestBody List<QuizQuestion> questions) {
        return quizService.getQuizById(id)
                .map(quiz -> {
                    // Filter duplicates and validate questions
                    List<QuizQuestion> validQuestions = questions.stream()
                            .filter(q -> q.getQuestion() != null && !q.getQuestion().trim().isEmpty())
                            .filter(q -> q.getOptionA() != null && !q.getOptionA().trim().isEmpty())
                            .filter(q -> q.getOptionB() != null && !q.getOptionB().trim().isEmpty())
                            .filter(q -> q.getOptionC() != null && !q.getOptionC().trim().isEmpty())
                            .filter(q -> q.getOptionD() != null && !q.getOptionD().trim().isEmpty())
                            .filter(q -> List.of("A", "B", "C", "D").contains(q.getCorrectAnswer().toUpperCase()))
                            .collect(Collectors.toList());

                    // Deduplicate by question text
                    Set<String> seen = new HashSet<>();
                    List<QuizQuestion> uniqueQuestions = validQuestions.stream()
                            .filter(q -> seen.add(q.getQuestion().trim().toLowerCase()))
                            .collect(Collectors.toList());

                    quiz.setQuestions(uniqueQuestions);
                    Quiz updated = quizService.createQuiz(quiz); // Saves updated questions count
                    return ResponseEntity.ok(new ApiResponse<>(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
