package com.lms.backend.assignment;

import com.lms.backend.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public ApiResponse<List<Assignment>> getAssignments(@RequestParam(required = false) String studentId) {
        if (studentId != null && !studentId.trim().isEmpty()) {
            return new ApiResponse<>(assignmentService.getAssignmentsForStudent(studentId));
        }
        return new ApiResponse<>(assignmentService.getAllAssignments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Assignment>> getAssignmentById(@PathVariable String id) {
        return assignmentService.getAssignmentById(id)
                .map(assignment -> ResponseEntity.ok(new ApiResponse<>(assignment)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Assignment>> createAssignment(@RequestBody Assignment assignment) {
        Assignment created = assignmentService.createAssignment(assignment);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Assignment>> updateAssignment(@PathVariable String id, @RequestBody Assignment assignment) {
        return assignmentService.updateAssignment(id, assignment)
                .map(updated -> ResponseEntity.ok(new ApiResponse<>(updated)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> deleteAssignment(@PathVariable String id) {
        boolean deleted = assignmentService.deleteAssignment(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse<>(true));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/student/{studentId}/stats")
    public ApiResponse<java.util.Map<String, Long>> getStudentAssignmentStats(@PathVariable String studentId) {
        List<Assignment> assignments = assignmentService.getAssignmentsForStudent(studentId);
        long pending = assignments.stream().filter(a -> "Pending".equalsIgnoreCase(a.getDisplayStatus()) || "Needs Revision".equalsIgnoreCase(a.getDisplayStatus())).count();
        long submitted = assignments.stream().filter(a -> "Submitted".equalsIgnoreCase(a.getDisplayStatus())).count();
        long reviewed = assignments.stream().filter(a -> "Reviewed".equalsIgnoreCase(a.getDisplayStatus())).count();
        long overdue = assignments.stream().filter(a -> "Overdue".equalsIgnoreCase(a.getDisplayStatus())).count();
        long lateSubmitted = assignments.stream().filter(a -> "Late Submitted".equalsIgnoreCase(a.getDisplayStatus())).count();

        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("pending", pending);
        stats.put("submitted", submitted);
        stats.put("reviewed", reviewed);
        stats.put("overdue", overdue);
        stats.put("lateSubmitted", lateSubmitted);
        return new ApiResponse<>(stats);
    }
}
