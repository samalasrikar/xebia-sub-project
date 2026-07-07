package com.lms.backend.submission;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="submission_files")
public class SubmissionFile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;

    private String size;

    private String type;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "submission_id")
    private Submission submission;

    public SubmissionFile() {}

    public SubmissionFile(
            String name,
            String size,
            String type
    ) {
        this.name = name;
        this.size = size;
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Submission getSubmission() {
        return submission;
    }

    public void setSubmission(
            Submission submission
    ) {
        this.submission = submission;
    }
}