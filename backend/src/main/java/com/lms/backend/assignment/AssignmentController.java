package com.lms.backend.assignment;

import com.lms.backend.common.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

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
}
