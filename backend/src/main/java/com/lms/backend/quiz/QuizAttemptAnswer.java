package com.lms.backend.quiz;

import jakarta.persistence.Embeddable;

@Embeddable
public class QuizAttemptAnswer {
    private String question;
    private String studentAnswer;
    private String correctAnswer;

    public QuizAttemptAnswer() {}

    public QuizAttemptAnswer(String question, String studentAnswer, String correctAnswer) {
        this.question = question;
        this.studentAnswer = studentAnswer;
        this.correctAnswer = correctAnswer;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getStudentAnswer() {
        return studentAnswer;
    }

    public void setStudentAnswer(String studentAnswer) {
        this.studentAnswer = studentAnswer;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}
