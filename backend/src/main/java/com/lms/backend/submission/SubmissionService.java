package com.lms.backend.submission;

import com.lms.backend.assignment.AssignmentRepository;
import com.lms.backend.student.Student;
import com.lms.backend.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

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
            submission.setFeedback(gradeData.getFeedback() != null ? gradeData.getFeedback() : "");
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
                    // Check if there are other pending (Submitted) submissions for this assignment
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
        submission.setId("sub_" + System.currentTimeMillis());
        submission.setAssignmentId(submissionData.getAssignmentId());
        submission.setAssignmentTitle(submissionData.getAssignmentTitle());
        submission.setStudentId(studentId);
        submission.setStudentName(studentName);
        submission.setStudentAvatar("");
        submission.setBatch(batch);
        submission.setSubmittedAt("Just now");
        submission.setSubmittedDateRaw(Instant.now().toString());
        submission.setStatus("Submitted");
        submission.setAttempt(submissionData.getAttempt() != null ? submissionData.getAttempt() : 1);
        submission.setFiles(submissionData.getFiles());
        submission.setStudentNote(submissionData.getStudentNote() != null ? submissionData.getStudentNote() : "");
        submission.setScore(null);
        submission.setFeedback("");
        submission.setPrivateNotes("");
        submission.setEvaluator("");
        submission.setEvaluatedDate("");

        Submission saved = submissionRepository.save(submission);

        // Update student assignment list status to "Submitted"
        assignmentRepository.findById(submissionData.getAssignmentId()).ifPresent(assignment -> {
            assignment.setStatus("Submitted");
            assignmentRepository.save(assignment);
        });

        return saved;
    }
}
