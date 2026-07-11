package com.lms.backend.assignment;

import com.lms.backend.student.Student;
import com.lms.backend.student.StudentRepository;
import com.lms.backend.submission.Submission;
import com.lms.backend.submission.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    public List<Assignment> getAllAssignments() {

        List<Assignment> assignments =
                assignmentRepository.findAll();

        // Auto-update assignment statuses
        assignments.forEach(this::updateAssignmentStatusBasedOnDueDate);

        return assignmentRepository.findAll();
    }

    public List<Assignment> getAssignmentsForStudent(String studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (!studentOpt.isPresent()) {
            return Collections.emptyList();
        }
        
        Student student = studentOpt.get();
        List<Assignment> allAssignments = assignmentRepository.findAll();
        
        List<Assignment> assigned = allAssignments.stream()
                .filter(assignment -> {
                    String scope = assignment.getScope();
                    if (scope == null || scope.trim().isEmpty() || scope.equalsIgnoreCase("Entire Course")) {
                        return true;
                    }
                    
                    String batchField = assignment.getBatch();
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

        for (Assignment a : assigned) {
            Optional<Submission> subOpt = submissionRepository.findByStudentIdAndAssignmentId(studentId, a.getId());
            if (subOpt.isPresent()) {
                Submission sub = subOpt.get();
                a.setSubmissionId(sub.getId());
                if ("Graded".equalsIgnoreCase(sub.getStatus())) {
                    a.setDisplayStatus("Reviewed");
                    a.setScore(sub.getScore());
                } else if ("Late Submitted".equalsIgnoreCase(sub.getStatus())) {
                    a.setDisplayStatus("Late Submitted");
                } else if ("Submitted".equalsIgnoreCase(sub.getStatus())) {
                    a.setDisplayStatus("Submitted");
                } else if ("Revision Needed".equalsIgnoreCase(sub.getStatus())) {
                    a.setDisplayStatus("Needs Revision");
                } else {
                    a.setDisplayStatus("Submitted");
                }
            } else {
                boolean isOverdue = false;
                if (a.getDueDate() != null && !a.getDueDate().isEmpty()) {
                    try {
                        String dueDateString = a.getDueDate();
                        LocalDateTime dueDateTime;
                        if (dueDateString.contains("T")) {
                            dueDateTime = Instant.parse(dueDateString)
                                    .atZone(ZoneId.systemDefault())
                                    .toLocalDateTime();
                        } else {
                            LocalDate dueDate = LocalDate.parse(dueDateString);
                            dueDateTime = dueDate.atTime(23, 59, 59, 999);
                        }
                        if (LocalDateTime.now().isAfter(dueDateTime)) {
                            isOverdue = true;
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                if (isOverdue || "a5".equalsIgnoreCase(a.getId())) {
                    a.setDisplayStatus("Overdue");
                } else if ("Active".equalsIgnoreCase(a.getStatus()) || "Pending".equalsIgnoreCase(a.getStatus())) {
                    a.setDisplayStatus("Pending");
                } else {
                    a.setDisplayStatus(a.getStatus());
                }
            }
        }

        return assigned.stream()
                .filter(a -> !"Draft".equalsIgnoreCase(a.getStatus()))
                .collect(Collectors.toList());
    }

    public Optional<Assignment> getAssignmentById(String id) {

        Optional<Assignment> assignmentOptional =
                assignmentRepository.findById(id);

        assignmentOptional.ifPresent(
                this::updateAssignmentStatusBasedOnDueDate
        );

        return assignmentOptional;
    }

    public Assignment createAssignment(Assignment assignment) {

        if (assignment.getId() == null ||
                assignment.getId().trim().isEmpty()) {

            assignment.setId(
                    "a_" + System.currentTimeMillis()
            );
        }

        // Default status handling
        if (assignment.getStatus() == null ||
                assignment.getStatus().trim().isEmpty()) {

            assignment.setStatus("Active");
        }

        // Auto-update status from due date
        updateAssignmentStatusBasedOnDueDate(
                assignment
        );

        return assignmentRepository.save(assignment);
    }

    public Optional<Assignment> updateAssignment(
            String id,
            Assignment updatedAssignment
    ) {

        return assignmentRepository.findById(id)
                .map(existing -> {

                    if (updatedAssignment.getTitle() != null)
                        existing.setTitle(
                                updatedAssignment.getTitle()
                        );

                    if (updatedAssignment.getCourse() != null)
                        existing.setCourse(
                                updatedAssignment.getCourse()
                        );

                    if (updatedAssignment.getCourseId() != null)
                        existing.setCourseId(
                                updatedAssignment.getCourseId()
                        );

                    if (updatedAssignment.getBatch() != null)
                        existing.setBatch(
                                updatedAssignment.getBatch()
                        );

                    if (updatedAssignment.getBatchId() != null)
                        existing.setBatchId(
                                updatedAssignment.getBatchId()
                        );

                    if (updatedAssignment.getScope() != null)
                        existing.setScope(
                                updatedAssignment.getScope()
                        );

                    if (updatedAssignment.getDueDate() != null)
                        existing.setDueDate(
                                updatedAssignment.getDueDate()
                        );

                    // Only allow Draft manually
                    if (updatedAssignment.getStatus() != null &&
                            "Draft".equalsIgnoreCase(
                                    updatedAssignment.getStatus()
                            )) {

                        existing.setStatus("Draft");
                    }

                    if (updatedAssignment.getMaxMarks() != null)
                        existing.setMaxMarks(
                                updatedAssignment.getMaxMarks()
                        );

                    if (updatedAssignment.getWeightage() != null)
                        existing.setWeightage(
                                updatedAssignment.getWeightage()
                        );

                    if (updatedAssignment.getAttemptsAllowed() != null)
                        existing.setAttemptsAllowed(
                                updatedAssignment.getAttemptsAllowed()
                        );

                    if (updatedAssignment.getDescription() != null)
                        existing.setDescription(
                                updatedAssignment.getDescription()
                        );

                    if (updatedAssignment.getInstructions() != null)
                        existing.setInstructions(
                                updatedAssignment.getInstructions()
                        );

                    if (updatedAssignment.getAttachments() != null)
                        existing.setAttachments(
                                updatedAssignment.getAttachments()
                        );

                    existing.setSubmissionFormats(
                            updatedAssignment.getSubmissionFormats()
                    );

                    // Auto-update based on due date
                    updateAssignmentStatusBasedOnDueDate(
                            existing
                    );

                    return assignmentRepository.save(
                            existing
                    );
                });
    }

    public boolean deleteAssignment(String id) {

        if (assignmentRepository.existsById(id)) {

            assignmentRepository.deleteById(id);

            return true;
        }

        return false;
    }

    // -----------------------------
    // Assignment Status Logic
    // -----------------------------
    private void updateAssignmentStatusBasedOnDueDate(
            Assignment assignment
    ) {

        try {

            // Draft remains draft
            if ("Draft".equalsIgnoreCase(
                    assignment.getStatus()
            )) {
                return;
            }

            if (assignment.getDueDate() == null ||
                    assignment.getDueDate().isEmpty()) {

                assignment.setStatus("Active");

                return;
            }

            String dueDateString =
                    assignment.getDueDate();

            LocalDateTime dueDateTime;

            // ISO datetime
            if (dueDateString.contains("T")) {

                dueDateTime =
                        Instant.parse(dueDateString)
                                .atZone(
                                        ZoneId.systemDefault()
                                )
                                .toLocalDateTime();

            } else {

                // yyyy-MM-dd
                LocalDate dueDate =
                        LocalDate.parse(dueDateString);

                dueDateTime =
                        dueDate.atTime(23, 59);
            }

            LocalDateTime now =
                    LocalDateTime.now();

            // Deadline passed
            if (now.isAfter(dueDateTime)) {

                assignment.setStatus(
                        "Completed"
                );

            } else {

                assignment.setStatus(
                        "Active"
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

            assignment.setStatus("Active");
        }
    }
}
