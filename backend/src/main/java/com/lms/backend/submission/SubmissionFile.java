package com.lms.backend.submission;

import jakarta.persistence.Embeddable;

@Embeddable
public class SubmissionFile {
    private String name;
    private String size;
    private String type;

    public SubmissionFile() {}

    public SubmissionFile(String name, String size, String type) {
        this.name = name;
        this.size = size;
        this.type = type;
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
}
