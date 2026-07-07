package com.lms.backend.assignment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    public List<Assignment> getAllAssignments() {

        List<Assignment> assignments =
                assignmentRepository.findAll();

        // Auto-update assignment statuses
        assignments.forEach(this::updateAssignmentStatusBasedOnDueDate);

        return assignmentRepository.findAll();
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