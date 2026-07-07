package com.lms.backend.quiz;

import com.lms.backend.quiz.dto.QuizSubmitRequest;
import com.lms.backend.quiz.dto.QuizStatsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import com.lms.backend.student.Student;
import com.lms.backend.student.StudentRepository;

@Service
@SuppressWarnings("null")
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private StudentRepository studentRepository;

    @PostConstruct
    public void seedInitialData() {
        if (quizRepository.count() == 0) {
            // Seed Quiz 1
            Quiz q1 = new Quiz();
            q1.setId("quiz-1");
            q1.setName("React State Management");
            q1.setCourseId("c1");
            q1.setCourse("Cloud Native Engineering");
            q1.setBatch("B-2024-Q1");
            q1.setDuration(20);
            q1.setPassingMarks(2); // Since there are 3 questions, 2 correct answers to pass
            q1.setStatus("Published");
            q1.setCreatedDate("Jul 1, 2026");
            q1.setDescription("Assessment of local, contextual, and global state management techniques in React applications.");
            q1.setModule("Frontend Architecture");
            q1.setSubmodule("State Management & Reactivity");

            List<QuizQuestion> questions1 = new ArrayList<>();
            questions1.add(new QuizQuestion("Which hook is used to manage local component state in React?", "useContext", "useState", "useEffect", "useReducer", "B"));
            questions1.add(new QuizQuestion("What is the primary benefit of using useMemo in a React component?", "To trigger re-renders on variable changes", "To cache computationally expensive function results", "To handle async lifecycle events", "To access browser localStorage", "B"));
            questions1.add(new QuizQuestion("When would you prefer useReducer over useState?", "When component logic is simple", "When managing complex state transitions and actions", "When retrieving data from API routes", "When manipulating DOM nodes directly", "B"));
            q1.setQuestions(questions1);
            quizRepository.save(q1);

            // Seed Quiz 2
            Quiz q2 = new Quiz();
            q2.setId("quiz-2");
            q2.setName("Java Microservices Basics");
            q2.setCourseId("c1");
            q2.setCourse("Cloud Native Engineering");
            q2.setBatch("B-2023-Q4");
            q2.setDuration(30);
            q2.setPassingMarks(1);
            q2.setStatus("Published");
            q2.setCreatedDate("Jul 2, 2026");
            q2.setDescription("Fundamental concepts of Spring Cloud, service registry, and config management.");
            q2.setModule("Backend Systems");
            q2.setSubmodule("Microservices & Distributed Systems");

            List<QuizQuestion> questions2 = new ArrayList<>();
            questions2.add(new QuizQuestion("Which annotation is commonly used to designate a Spring Boot configuration class?", "@Controller", "@Configuration", "@Repository", "@Service", "B"));
            q2.setQuestions(questions2);
            quizRepository.save(q2);

            // Seed Quiz 3
            Quiz q3 = new Quiz();
            q3.setId("quiz-3");
            q3.setName("Vite & ESBuild Configuration");
            q3.setCourseId("c1");
            q3.setCourse("Cloud Native Engineering");
            q3.setBatch("B-2024-Q1");
            q3.setDuration(10);
            q3.setPassingMarks(4);
            q3.setStatus("Draft");
            q3.setCreatedDate("Jul 5, 2026");
            q3.setDescription("Configuring development servers, hot module replacement, and production asset optimization.");
            q3.setModule("Build Tooling");
            q3.setSubmodule("Vite & Bundlers");
            q3.setQuestions(new ArrayList<>());
            quizRepository.save(q3);
        }

        if (quizAttemptRepository.count() == 0) {
            // Seed attempts for Jane Doe on Quiz 1
            QuizAttempt a1 = new QuizAttempt();
            a1.setId("attempt-1");
            a1.setQuizId("quiz-1");
            a1.setStudentId("s4");
            a1.setStudentName("Jane Doe");
            a1.setCourse("Cloud Native Engineering");
            a1.setBatch("B-2024-Q1");
            a1.setScore(3);
            a1.setPercentage(100);
            a1.setAttemptDate("Jul 6, 2026");
            a1.setTimeTaken("8 mins");
            a1.setStatus("Pass");

            List<QuizAttemptAnswer> answers1 = new ArrayList<>();
            answers1.add(new QuizAttemptAnswer("Which hook is used to manage local component state in React?", "B", "B"));
            answers1.add(new QuizAttemptAnswer("What is the primary benefit of using useMemo in a React component?", "B", "B"));
            answers1.add(new QuizAttemptAnswer("When would you prefer useReducer over useState?", "B", "B"));
            a1.setAnswers(answers1);
            quizAttemptRepository.save(a1);

            // Seed attempts for Alex Mercer on Quiz 1
            QuizAttempt a2 = new QuizAttempt();
            a2.setId("attempt-2");
            a2.setQuizId("quiz-1");
            a2.setStudentId("s1");
            a2.setStudentName("Alex Mercer");
            a2.setCourse("Cloud Native Engineering");
            a2.setBatch("B-2023-Q4");
            a2.setScore(2);
            a2.setPercentage(67);
            a2.setAttemptDate("Jul 5, 2026");
            a2.setTimeTaken("12 mins");
            a2.setStatus("Fail");

            List<QuizAttemptAnswer> answers2 = new ArrayList<>();
            answers2.add(new QuizAttemptAnswer("Which hook is used to manage local component state in React?", "B", "B"));
            answers2.add(new QuizAttemptAnswer("What is the primary benefit of using useMemo in a React component?", "A", "B"));
            answers2.add(new QuizAttemptAnswer("When would you prefer useReducer over useState?", "B", "B"));
            a2.setAnswers(answers2);
            quizAttemptRepository.save(a2);

            // Seed attempts for Jane Doe on Quiz 2
            QuizAttempt a3 = new QuizAttempt();
            a3.setId("attempt-3");
            a3.setQuizId("quiz-2");
            a3.setStudentId("s4");
            a3.setStudentName("Jane Doe");
            a3.setCourse("Cloud Native Engineering");
            a3.setBatch("B-2024-Q1");
            a3.setScore(1);
            a3.setPercentage(100);
            a3.setAttemptDate("Jul 6, 2026");
            a3.setTimeTaken("2 mins");
            a3.setStatus("Pass");

            List<QuizAttemptAnswer> answers3 = new ArrayList<>();
            answers3.add(new QuizAttemptAnswer("Which annotation is commonly used to designate a Spring Boot configuration class?", "B", "B"));
            a3.setAnswers(answers3);
            quizAttemptRepository.save(a3);
        }
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Optional<Quiz> getQuizById(String id) {
        return quizRepository.findById(id);
    }

    private void validateQuiz(Quiz quiz) {
        if (quiz.getName() == null || quiz.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Quiz Name is required.");
        }
        if ("Published".equalsIgnoreCase(quiz.getStatus())) {
            if (quiz.getQuestions() == null || quiz.getQuestions().isEmpty()) {
                throw new IllegalArgumentException("Cannot publish a quiz with no questions.");
            }
            for (int i = 0; i < quiz.getQuestions().size(); i++) {
                QuizQuestion q = quiz.getQuestions().get(i);
                if (q.getQuestion() == null || q.getQuestion().trim().isEmpty() ||
                    q.getOptionA() == null || q.getOptionA().trim().isEmpty() ||
                    q.getOptionB() == null || q.getOptionB().trim().isEmpty() ||
                    q.getOptionC() == null || q.getOptionC().trim().isEmpty() ||
                    q.getOptionD() == null || q.getOptionD().trim().isEmpty() ||
                    q.getCorrectAnswer() == null || q.getCorrectAnswer().trim().isEmpty()) {
                    throw new IllegalArgumentException("Please complete all fields for Question #" + (i + 1));
                }
            }
        }
    }

    public Quiz createQuiz(Quiz quiz) {
        if (quiz.getId() == null || quiz.getId().trim().isEmpty()) {
            quiz.setId("quiz-" + System.currentTimeMillis());
        }
        if (quiz.getStatus() == null || quiz.getStatus().trim().isEmpty()) {
            quiz.setStatus("Draft");
        }
        validateQuiz(quiz);
        quiz.setCreatedDate(LocalDate.now().format(DateTimeFormatter.ofPattern("MMM d, yyyy")));
        quiz.setQuestionsCount(quiz.getQuestions() != null ? quiz.getQuestions().size() : 0);
        return quizRepository.save(quiz);
    }

    public Optional<Quiz> updateQuiz(String id, Quiz updatedQuiz) {
        return quizRepository.findById(id).map(existing -> {
            if (updatedQuiz.getName() != null) existing.setName(updatedQuiz.getName());
            if (updatedQuiz.getDescription() != null) existing.setDescription(updatedQuiz.getDescription());
            if (updatedQuiz.getCourseId() != null) existing.setCourseId(updatedQuiz.getCourseId());
            if (updatedQuiz.getCourse() != null) existing.setCourse(updatedQuiz.getCourse());
            if (updatedQuiz.getModule() != null) existing.setModule(updatedQuiz.getModule());
            if (updatedQuiz.getSubmodule() != null) existing.setSubmodule(updatedQuiz.getSubmodule());
            if (updatedQuiz.getBatch() != null) existing.setBatch(updatedQuiz.getBatch());
            if (updatedQuiz.getScope() != null) existing.setScope(updatedQuiz.getScope());
            if (updatedQuiz.getDuration() != null) existing.setDuration(updatedQuiz.getDuration());
            if (updatedQuiz.getPassingMarks() != null) existing.setPassingMarks(updatedQuiz.getPassingMarks());
            if (updatedQuiz.getStatus() != null) existing.setStatus(updatedQuiz.getStatus());
            if (updatedQuiz.getQuestions() != null) {
                existing.setQuestions(updatedQuiz.getQuestions());
            }
            validateQuiz(existing);
            return quizRepository.save(existing);
        });
    }

    public boolean deleteQuiz(String id) {
        if (quizRepository.existsById(id)) {
            quizRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<QuizAttempt> getQuizResults(String quizId) {
        return quizAttemptRepository.findByQuizId(quizId);
    }

    public Optional<QuizAttempt> getStudentResultForQuiz(String quizId, String studentId) {
        return quizAttemptRepository.findByQuizIdAndStudentId(quizId, studentId);
    }

    public QuizAttempt submitQuizAttempt(String quizId, QuizSubmitRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found with ID: " + quizId));

        // Evaluate answers
        List<QuizAttemptAnswer> attemptAnswers = new ArrayList<>();
        int correctCount = 0;

        for (QuizQuestion q : quiz.getQuestions()) {
            // Find student's answer for this question
            String studentAnswer = request.getAnswers().stream()
                    .filter(ans -> ans.getQuestion().trim().equalsIgnoreCase(q.getQuestion().trim()))
                    .map(QuizSubmitRequest.AnswerSubmission::getStudentAnswer)
                    .findFirst()
                    .orElse("");

            boolean isCorrect = studentAnswer.trim().equalsIgnoreCase(q.getCorrectAnswer().trim());
            if (isCorrect) {
                correctCount++;
            }

            attemptAnswers.add(new QuizAttemptAnswer(q.getQuestion(), studentAnswer, q.getCorrectAnswer()));
        }

        int percentage = quiz.getQuestions().isEmpty() ? 0 : (int) Math.round(((double) correctCount / quiz.getQuestions().size()) * 100);
        String verdict = correctCount >= quiz.getPassingMarks() ? "Pass" : "Fail";

        // Remove existing attempts by the same student on this quiz to simulate a retake/single active attempt
        quizAttemptRepository.findByQuizIdAndStudentId(quizId, request.getStudentId())
                .ifPresent(existing -> quizAttemptRepository.delete(existing));

        QuizAttempt attempt = new QuizAttempt();
        attempt.setId("attempt_" + System.currentTimeMillis());
        attempt.setQuizId(quizId);
        attempt.setStudentId(request.getStudentId());
        attempt.setStudentName(request.getStudentName() != null ? request.getStudentName() : "Jane Doe");
        attempt.setCourse(quiz.getCourse());
        attempt.setBatch(quiz.getBatch() != null ? quiz.getBatch() : "B-2024-Q1");
        attempt.setScore(correctCount);
        attempt.setPercentage(percentage);
        attempt.setAttemptDate(LocalDate.now().format(DateTimeFormatter.ofPattern("MMM d, yyyy")));
        attempt.setTimeTaken(request.getTimeTaken() != null ? request.getTimeTaken() : "1 mins");
        attempt.setStatus(verdict);
        attempt.setAnswers(attemptAnswers);

        return quizAttemptRepository.save(attempt);
    }

    public QuizStatsDto getQuizStats() {
        List<Quiz> quizzes = quizRepository.findAll();
        List<QuizAttempt> attempts = quizAttemptRepository.findAll();

        long total = quizzes.size();
        long published = quizzes.stream().filter(q -> "Published".equalsIgnoreCase(q.getStatus())).count();
        long drafts = quizzes.stream().filter(q -> "Draft".equalsIgnoreCase(q.getStatus())).count();
        long imported = quizzes.stream().filter(q -> "Draft".equalsIgnoreCase(q.getStatus()) && q.getQuestionsCount() > 0).count();

        String avgScorePercent = "78%";
        if (!attempts.isEmpty()) {
            double sum = attempts.stream().mapToDouble(QuizAttempt::getPercentage).sum();
            avgScorePercent = Math.round(sum / attempts.size()) + "%";
        }

        return new QuizStatsDto(total, published, drafts, imported, avgScorePercent);
    }

    public List<Quiz> getQuizzesForStudent(String studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (!studentOpt.isPresent()) {
            return Collections.emptyList();
        }
        
        Student student = studentOpt.get();
        List<Quiz> allQuizzes = quizRepository.findAll();
        
        List<Quiz> filtered = allQuizzes.stream()
                .filter(quiz -> {
                    // Check status is Published
                    if (!"Published".equalsIgnoreCase(quiz.getStatus())) {
                        return false;
                    }

                    String scope = quiz.getScope();
                    if (scope == null || scope.trim().isEmpty() || scope.equalsIgnoreCase("Entire Course")) {
                        return true;
                    }
                    
                    String batchField = quiz.getBatch();
                    if (batchField == null || batchField.trim().isEmpty()) {
                        return false;
                    }
                    
                    List<String> items = Arrays.stream(batchField.split(","))
                            .map(String::trim)
                            .collect(Collectors.toList());
                    
                    if (scope.equalsIgnoreCase("Specific Batches")) {
                        return items.stream().anyMatch(b -> b.equalsIgnoreCase(student.getBatch()));
                    } else if (scope.equalsIgnoreCase("Individual Students")) {
                        return items.stream().anyMatch(name -> name.equalsIgnoreCase(student.getName()));
                    }
                    
                    return false;
                })
                .collect(Collectors.toList());

        for (Quiz q : filtered) {
            Optional<QuizAttempt> attemptOpt = quizAttemptRepository.findByQuizIdAndStudentId(q.getId(), studentId);
            if (attemptOpt.isPresent()) {
                QuizAttempt attempt = attemptOpt.get();
                q.setAttemptStatus("Completed");
                q.setScore(attempt.getScore());
                q.setPercentage(attempt.getPercentage());
                q.setVerdict(attempt.getStatus());
                q.setAttemptDate(attempt.getAttemptDate());
            } else {
                q.setAttemptStatus("Pending");
                q.setScore(null);
                q.setPercentage(0);
                q.setVerdict(null);
                q.setAttemptDate(null);
            }
        }

        return filtered;
    }
}
