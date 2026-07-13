package com.lms.backend.student;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> getStudentsByBatch(String batch) {
        return studentRepository.findByBatch(batch);
    }

    public Optional<Student> getStudentById(String id) {
        return studentRepository.findById(id);
    }

    public Student createStudent(Student student) {
        if (student.getId() == null || student.getId().trim().isEmpty()) {
            student.setId("s_" + System.currentTimeMillis());
        }
        if (student.getStatus() == null || student.getStatus().trim().isEmpty()) {
            student.setStatus("Active");
        }
        return studentRepository.save(student);
    }
}
