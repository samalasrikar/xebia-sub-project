package com.lms.backend.batch;

import com.lms.backend.common.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/batches")
public class BatchController {

    @Autowired
    private BatchService batchService;

    @GetMapping
    public ApiResponse<List<Batch>> getBatches() {
        return new ApiResponse<>(batchService.getAllBatches());
    }
}
