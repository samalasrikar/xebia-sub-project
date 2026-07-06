package com.lms.backend.submission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
    List<Submission> findByStudentId(String studentId);
    Optional<Submission> findByStudentIdAndAssignmentId(String studentId, String assignmentId);
}
