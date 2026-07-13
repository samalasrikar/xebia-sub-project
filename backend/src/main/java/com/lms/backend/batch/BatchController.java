package com.lms.backend.batch;

import com.lms.backend.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/batches")
public class BatchController {

    private final BatchService batchService;

    public BatchController(BatchService batchService) {
        this.batchService = batchService;
    }

    @GetMapping
    public ApiResponse<List<Batch>> getBatches() {
        return new ApiResponse<>(batchService.getAllBatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Batch>> getBatchById(@PathVariable String id) {
        return batchService.getBatchById(id)
                .map(batch -> ResponseEntity.ok(new ApiResponse<>(batch)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Batch>> createBatch(@RequestBody Batch batch) {
        Batch created = batchService.createBatch(batch);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Batch>> updateBatch(@PathVariable String id, @RequestBody Batch batch) {
        return batchService.updateBatch(id, batch)
                .map(updated -> ResponseEntity.ok(new ApiResponse<>(updated)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> deleteBatch(@PathVariable String id) {
        boolean deleted = batchService.deleteBatch(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse<>(true));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
