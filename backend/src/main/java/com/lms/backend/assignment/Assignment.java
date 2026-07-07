package com.lms.backend.assignment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.lms.backend.submission.Submission;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "assignment")
public class Assignment {

    @Id
    private String id;

    private String title;

    private String course;

    @Column(name = "course_id")
    private String courseId;

    private String batch;

    @Column(name = "batch_id")
    private String batchId;

    private String scope;

    @Column(name = "due_date")
    private String dueDate;

    private String status;

    @Column(name = "max_marks")
    private Integer maxMarks;

    private String weightage;

    @Column(name = "attempts_allowed")
    private String attemptsAllowed;

    @Column(length = 2000)
    private String description;

    @Column(length = 2000)
    private String instructions;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "assignment_attachments",
            joinColumns = @JoinColumn(name = "assignment_id")
    )
    private List<AssignmentAttachment> attachments =
            new ArrayList<>();

    @JsonManagedReference
    @OneToMany(
            mappedBy = "assignment",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Submission> submissions =
            new ArrayList<>();

    @JsonIgnore
    @Column(name = "submission_formats")
    private String submissionFormats;

    @Transient
    private String displayStatus;

    @Transient
    private Integer score;

    @Transient
    private String submissionId;

    public Assignment() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getBatch() {
        return batch;
    }

    public void setBatch(String batch) {
        this.batch = batch;
    }

    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(Integer maxMarks) {
        this.maxMarks = maxMarks;
    }

    public String getWeightage() {
        return weightage;
    }

    public void setWeightage(String weightage) {
        this.weightage = weightage;
    }

    public String getAttemptsAllowed() {
        return attemptsAllowed;
    }

    public void setAttemptsAllowed(String attemptsAllowed) {
        this.attemptsAllowed = attemptsAllowed;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public List<AssignmentAttachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(
            List<AssignmentAttachment> attachments
    ) {
        this.attachments = attachments;
    }

    public List<Submission> getSubmissions() {
        return submissions;
    }

    public void setSubmissions(
            List<Submission> submissions
    ) {
        this.submissions = submissions;
    }

    public List<String> getSubmissionFormats() {

        if (submissionFormats == null ||
                submissionFormats.trim().isEmpty()) {

            return Collections.emptyList();
        }

        return Arrays.asList(
                submissionFormats.split(",")
        );
    }

    public void setSubmissionFormats(
            List<String> formats
    ) {

        if (formats == null || formats.isEmpty()) {

            this.submissionFormats = "";

        } else {

            this.submissionFormats =
                    String.join(",", formats);
        }
    }
    public String getDisplayStatus() {
        return displayStatus;
    }

    public void setDisplayStatus(String displayStatus) {
        this.displayStatus = displayStatus;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(String submissionId) {
        this.submissionId = submissionId;
    }
}
