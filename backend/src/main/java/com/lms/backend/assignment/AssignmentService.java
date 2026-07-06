package com.lms.backend.assignment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<Assignment> getAssignmentById(String id) {
        return assignmentRepository.findById(id);
    }

    public Assignment createAssignment(Assignment assignment) {
        if (assignment.getId() == null || assignment.getId().trim().isEmpty()) {
            assignment.setId("a_" + System.currentTimeMillis());
        }
        if (assignment.getStatus() == null || assignment.getStatus().trim().isEmpty()) {
            assignment.setStatus("Active");
        }
        return assignmentRepository.save(assignment);
    }

    public Optional<Assignment> updateAssignment(String id, Assignment updatedAssignment) {
        return assignmentRepository.findById(id).map(existing -> {
            if (updatedAssignment.getTitle() != null) existing.setTitle(updatedAssignment.getTitle());
            if (updatedAssignment.getCourse() != null) existing.setCourse(updatedAssignment.getCourse());
            if (updatedAssignment.getCourseId() != null) existing.setCourseId(updatedAssignment.getCourseId());
            if (updatedAssignment.getBatch() != null) existing.setBatch(updatedAssignment.getBatch());
            if (updatedAssignment.getBatchId() != null) existing.setBatchId(updatedAssignment.getBatchId());
            if (updatedAssignment.getScope() != null) existing.setScope(updatedAssignment.getScope());
            if (updatedAssignment.getDueDate() != null) existing.setDueDate(updatedAssignment.getDueDate());
            if (updatedAssignment.getStatus() != null) existing.setStatus(updatedAssignment.getStatus());
            if (updatedAssignment.getMaxMarks() != null) existing.setMaxMarks(updatedAssignment.getMaxMarks());
            if (updatedAssignment.getWeightage() != null) existing.setWeightage(updatedAssignment.getWeightage());
            if (updatedAssignment.getAttemptsAllowed() != null) existing.setAttemptsAllowed(updatedAssignment.getAttemptsAllowed());
            if (updatedAssignment.getDescription() != null) existing.setDescription(updatedAssignment.getDescription());
            if (updatedAssignment.getInstructions() != null) existing.setInstructions(updatedAssignment.getInstructions());
            if (updatedAssignment.getAttachments() != null) existing.setAttachments(updatedAssignment.getAttachments());
            
            // Re-map formats using the helper List getter
            existing.setSubmissionFormats(updatedAssignment.getSubmissionFormats());

            return assignmentRepository.save(existing);
        });
    }

    public boolean deleteAssignment(String id) {
        if (assignmentRepository.existsById(id)) {
            assignmentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
