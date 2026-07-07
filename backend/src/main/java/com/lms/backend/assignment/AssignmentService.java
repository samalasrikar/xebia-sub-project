package com.lms.backend.assignment;

import com.lms.backend.student.Student;
import com.lms.backend.student.StudentRepository;
import com.lms.backend.submission.Submission;
import com.lms.backend.submission.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
                } else if ("Submitted".equalsIgnoreCase(sub.getStatus())) {
                    a.setDisplayStatus("Submitted");
                } else if ("Revision Needed".equalsIgnoreCase(sub.getStatus())) {
                    a.setDisplayStatus("Needs Revision");
                } else {
                    a.setDisplayStatus("Submitted");
                }
            } else {
                if ("a5".equalsIgnoreCase(a.getId())) {
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

