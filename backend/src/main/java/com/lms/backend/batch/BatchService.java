package com.lms.backend.batch;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class BatchService {

    @Autowired
    private BatchRepository batchRepository;

    @PostConstruct
    public void seedInitialData() {
        if (batchRepository.count() == 0) {
            Batch b1 = new Batch();
            b1.setId("BT-9921");
            b1.setName("Fall Cohort 2024-A");
            b1.setCourse("Cloud Native Engineering");
            b1.setCapacity(50);
            b1.setStartDate("2024-09-15");
            b1.setEndDate("2024-12-20");
            b1.setStatus("Active");
            b1.setInstructor("Dr. Elena Richards");
            b1.setStudentIds(Arrays.asList("s1", "s2", "s3", "s4"));
            batchRepository.save(b1);

            Batch b2 = new Batch();
            b2.setId("BT-8812");
            b2.setName("Data Science Bootcamp");
            b2.setCourse("Data Engineering Masters");
            b2.setCapacity(30);
            b2.setStartDate("2024-10-01");
            b2.setEndDate("2025-01-15");
            b2.setStatus("Upcoming");
            b2.setInstructor("Prof. Marcus Thorne");
            b2.setStudentIds(Arrays.asList("s5", "s6"));
            batchRepository.save(b2);

            Batch b3 = new Batch();
            b3.setId("BT-7651");
            b3.setName("UI/UX Intensive");
            b3.setCourse("Cloud Native Engineering");
            b3.setCapacity(25);
            b3.setStartDate("2024-08-05");
            b3.setEndDate("2024-10-12");
            b3.setStatus("Completed");
            b3.setInstructor("Sarah Jenkins");
            b3.setStudentIds(Arrays.asList("s7"));
            batchRepository.save(b3);
        }
    }

    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    public Optional<Batch> getBatchById(String id) {
        return batchRepository.findById(id);
    }

    public Batch createBatch(Batch batch) {
        if (batch.getId() == null || batch.getId().trim().isEmpty()) {
            batch.setId("BT-" + (1000 + (int)(Math.random() * 9000)));
        }
        if (batch.getStatus() == null || batch.getStatus().trim().isEmpty()) {
            batch.setStatus("Active");
        }
        batch.setEnrolled(batch.getStudentIds() != null ? batch.getStudentIds().size() : 0);
        return batchRepository.save(batch);
    }

    public Optional<Batch> updateBatch(String id, Batch updatedBatch) {
        return batchRepository.findById(id).map(existing -> {
            if (updatedBatch.getName() != null) existing.setName(updatedBatch.getName());
            if (updatedBatch.getCourse() != null) existing.setCourse(updatedBatch.getCourse());
            if (updatedBatch.getCapacity() != null) existing.setCapacity(updatedBatch.getCapacity());
            if (updatedBatch.getStartDate() != null) existing.setStartDate(updatedBatch.getStartDate());
            if (updatedBatch.getEndDate() != null) existing.setEndDate(updatedBatch.getEndDate());
            if (updatedBatch.getStatus() != null) existing.setStatus(updatedBatch.getStatus());
            if (updatedBatch.getInstructor() != null) existing.setInstructor(updatedBatch.getInstructor());
            if (updatedBatch.getStudentIds() != null) {
                existing.setStudentIds(updatedBatch.getStudentIds());
            }
            return batchRepository.save(existing);
        });
    }

    public boolean deleteBatch(String id) {
        if (batchRepository.existsById(id)) {
            batchRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
