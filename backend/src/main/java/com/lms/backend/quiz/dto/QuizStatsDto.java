package com.lms.backend.quiz.dto;

public class QuizStatsDto {
    private long total;
    private long published;
    private long drafts;
    private long imported;
    private String avgScorePercent;

    public QuizStatsDto() {}

    public QuizStatsDto(long total, long published, long drafts, long imported, String avgScorePercent) {
        this.total = total;
        this.published = published;
        this.drafts = drafts;
        this.imported = imported;
        this.avgScorePercent = avgScorePercent;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getPublished() {
        return published;
    }

    public void setPublished(long published) {
        this.published = published;
    }

    public long getDrafts() {
        return drafts;
    }

    public void setDrafts(long drafts) {
        this.drafts = drafts;
    }

    public long getImported() {
        return imported;
    }

    public void setImported(long imported) {
        this.imported = imported;
    }

    public String getAvgScorePercent() {
        return avgScorePercent;
    }

    public void setAvgScorePercent(String avgScorePercent) {
        this.avgScorePercent = avgScorePercent;
    }
}
