package com.lms.backend.submission;

import com.lms.backend.assignment.Assignment;
import com.lms.backend.assignment.AssignmentRepository;
import com.lms.backend.student.Student;
import com.lms.backend.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    public Optional<Submission> getSubmissionById(String id) {
        return submissionRepository.findById(id);
    }

    public List<Submission> getStudentSubmissions(String studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    public Optional<Submission> gradeSubmission(String id, Submission gradeData) {

        return submissionRepository.findById(id).map(submission -> {

            submission.setStatus("Graded");

            submission.setScore(gradeData.getScore());

            submission.setFeedback(
                    gradeData.getFeedback() != null
                            ? gradeData.getFeedback()
                            : ""
            );

            submission.setPrivateNotes(
                    gradeData.getPrivateNotes() != null
                            ? gradeData.getPrivateNotes()
                            : ""
            );

            submission.setEvaluator(
                    gradeData.getEvaluator() != null &&
                            !gradeData.getEvaluator().trim().isEmpty()
                            ? gradeData.getEvaluator()
                            : "Dr. Sarah Jenkins"
            );

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern("MMM d, yyyy");

            submission.setEvaluatedDate(
                    LocalDate.now().format(formatter)
            );

            return submissionRepository.save(submission);
        });
    }

    public Optional<Submission> rejectSubmission(String id, Submission gradeData) {
        return submissionRepository.findById(id).map(submission -> {
            submission.setStatus("Rejected");
            submission.setScore(0);
            submission.setFeedback(gradeData.getFeedback() != null ? "[REJECTED] " + gradeData.getFeedback() : "[REJECTED]");
            submission.setPrivateNotes(gradeData.getPrivateNotes() != null ? gradeData.getPrivateNotes() : "");
            submission.setEvaluator(gradeData.getEvaluator() != null && !gradeData.getEvaluator().trim().isEmpty() 
                    ? gradeData.getEvaluator() 
                    : "Dr. Sarah Jenkins");
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d, yyyy");
            submission.setEvaluatedDate(LocalDate.now().format(formatter));

            Submission saved = submissionRepository.save(submission);

            // Auto-update assignment status if needed
            assignmentRepository.findById(submission.getAssignmentId()).ifPresent(assignment -> {
                if ("Active".equalsIgnoreCase(assignment.getStatus())) {
                    List<Submission> allSubmissions = submissionRepository.findAll();
                    boolean remainingPending = allSubmissions.stream()
                            .anyMatch(s -> s.getAssignmentId().equals(submission.getAssignmentId()) 
                                    && "Submitted".equalsIgnoreCase(s.getStatus()) 
                                    && !s.getId().equals(id));
                    if (!remainingPending) {
                        assignment.setStatus("Completed");
                        assignmentRepository.save(assignment);
                    }
                }
            });

            return saved;
        });
    }

    public Submission submitAssignment(String studentId, Submission submissionData) {
        // Remove existing submission from the same student and assignment to simulate resubmission
        submissionRepository.findByStudentIdAndAssignmentId(studentId, submissionData.getAssignmentId())
                .ifPresent(existing -> submissionRepository.delete(existing));

        // Fetch student details from DB to enforce backend authority
        String studentName = "Jane Doe";
        String batch = "Batch 2023-A";
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isPresent()) {
            studentName = studentOpt.get().getName();
            batch = studentOpt.get().getBatch();
        }

        Submission submission = new Submission();

        submission.setId(
                "sub_" + System.currentTimeMillis()
        );

        submission.setAssignmentId(
                submissionData.getAssignmentId()
        );

        submission.setAssignmentTitle(
                submissionData.getAssignmentTitle()
        );

        submission.setStudentId(studentId);
        submission.setStudentName(studentName);
        submission.setStudentAvatar("");
        submission.setBatch(batch);
        submission.setSubmittedAt("Just now");

        submission.setSubmittedDateRaw(
                Instant.now().toString()
        );

        // Determine submission status
        final String[] submissionStatus = {"Submitted"};

        Optional<Assignment> assignmentOptional =
                assignmentRepository.findById(
                        submissionData.getAssignmentId()
                );

        if (assignmentOptional.isPresent()) {

            Assignment assignment =
                    assignmentOptional.get();

            // Set JPA relationship
            submission.setAssignment(assignment);

            try {

                if (assignment.getDueDate() != null &&
                        !assignment.getDueDate().isEmpty()) {

                    String dueDateString =
                            assignment.getDueDate();

                    LocalDateTime dueDateTime;

                    // Full ISO format
                    if (dueDateString.contains("T")) {

                        dueDateTime =
                                Instant.parse(dueDateString)
                                        .atZone(
                                                ZoneId.systemDefault()
                                        )
                                        .toLocalDateTime();

                    } else {

                        // yyyy-MM-dd format
                        DateTimeFormatter formatter =
        DateTimeFormatter.ofPattern(
                "MMM d, yyyy"
        );

LocalDate dueDate =
        LocalDate.parse(
                dueDateString,
                formatter
        );

dueDateTime =
        dueDate.atTime(23, 59);
                    }

                    LocalDateTime now =
                            LocalDateTime.now();
                    System.out.println("Due Date Raw: " + assignment.getDueDate());
                    System.out.println("Parsed Due Date: " + dueDateTime);
                    System.out.println("Current Time: " + now);
                    if (now.isAfter(dueDateTime)) {

                        submissionStatus[0] =
                                "Late Submitted";
                    }
                }

            } catch (Exception e) {

                e.printStackTrace();
            }
        }

        submission.setStatus(submissionStatus[0]);

        submission.setAttempt(
                submissionData.getAttempt() != null
                        ? submissionData.getAttempt()
                        : 1
        );

        List<SubmissionFile> files =
            submissionData.getFiles();

        if (files != null) {

            for (SubmissionFile file : files) {

                file.setSubmission(submission);
            }

            submission.setFiles(files);
        }

        submission.setStudentNote(
                submissionData.getStudentNote() != null
                        ? submissionData.getStudentNote()
                        : ""
        );

        submission.setScore(null);

        submission.setFeedback("");

        submission.setPrivateNotes("");

        submission.setEvaluator("");

        submission.setEvaluatedDate("");

        // Assignment statuses:
        // Draft / Active / Completed

        // Submission statuses:
        // Submitted / Late Submitted / Graded

        return submissionRepository.save(submission);
    }
    public java.util.Map<String, Object> getGradebookStats() {
        List<Submission> submissions = submissionRepository.findAll();
        long total = submissions.size();
        long pending = submissions.stream()
                .filter(s -> "Submitted".equalsIgnoreCase(s.getStatus()) || "Pending".equalsIgnoreCase(s.getStatus()))
                .count();
        List<Submission> graded = submissions.stream()
                .filter(s -> "Graded".equalsIgnoreCase(s.getStatus()) && s.getScore() != null)
                .collect(Collectors.toList());
        
        String average = "N/A";
        if (!graded.isEmpty()) {
            double avg = graded.stream().mapToInt(Submission::getScore).average().orElse(0.0);
            average = Math.round(avg) + "%";
        }

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("total", total);
        stats.put("pending", pending);
        stats.put("average", average);
        return stats;
    }
}
