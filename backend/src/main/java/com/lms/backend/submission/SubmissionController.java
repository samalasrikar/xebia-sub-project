package com.lms.backend.submission;

import com.lms.backend.common.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @GetMapping("/submissions")
    public ApiResponse<List<Submission>> getSubmissions() {
        return new ApiResponse<>(submissionService.getAllSubmissions());
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<ApiResponse<Submission>> getSubmissionById(@PathVariable String id) {
        return submissionService.getSubmissionById(id)
                .map(submission -> ResponseEntity.ok(new ApiResponse<>(submission)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/student/{studentId}/submissions")
    public ApiResponse<List<Submission>> getStudentSubmissions(@PathVariable String studentId) {
        return new ApiResponse<>(submissionService.getStudentSubmissions(studentId));
    }

    @PostMapping("/submissions/{id}/grade")
    public ResponseEntity<ApiResponse<Submission>> gradeSubmission(@PathVariable String id, @RequestBody Submission gradeData) {
        return submissionService.gradeSubmission(id, gradeData)
                .map(graded -> ResponseEntity.ok(new ApiResponse<>(graded)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/submissions/{id}/reject")
    public ResponseEntity<ApiResponse<Submission>> rejectSubmission(@PathVariable String id, @RequestBody Submission gradeData) {
        return submissionService.rejectSubmission(id, gradeData)
                .map(rejected -> ResponseEntity.ok(new ApiResponse<>(rejected)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/student/{studentId}/submit")
    public ResponseEntity<ApiResponse<Submission>> submitAssignment(@PathVariable String studentId, @RequestBody Submission submissionData) {
        Submission created = submissionService.submitAssignment(studentId, submissionData);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(created));
    }
}
