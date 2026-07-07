package com.lms.backend.submission;

import com.lms.backend.assignment.Assignment;
import com.lms.backend.assignment.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

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

    public Submission submitAssignment(
            String studentId,
            Submission submissionData
    ) {

        // Remove old submission if resubmitted
        submissionRepository
                .findByStudentIdAndAssignmentId(
                        studentId,
                        submissionData.getAssignmentId()
                )
                .ifPresent(existing ->
                        submissionRepository.delete(existing)
                );

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

        submission.setStudentName(
                submissionData.getStudentName() != null
                        ? submissionData.getStudentName()
                        : "Jane Doe"
        );

        submission.setStudentAvatar("");

        submission.setBatch(
                submissionData.getBatch() != null
                        ? submissionData.getBatch()
                        : "Batch 2023-A"
        );

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
}