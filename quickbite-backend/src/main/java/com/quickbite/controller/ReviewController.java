package com.quickbite.controller;

import com.quickbite.config.JwtUtil;
import com.quickbite.dto.ApiResponse;
import com.quickbite.model.Review;
import com.quickbite.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtUtil jwtUtil;

    /** GET /api/reviews/featured — for homepage testimonials */
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Review>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getFeatured()));
    }

    /** GET /api/reviews/restaurant/{id} */
    @GetMapping("/restaurant/{id}")
    public ResponseEntity<ApiResponse<List<Review>>> getByRestaurant(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getByRestaurant(id)));
    }

    /** POST /api/reviews — authenticated */
    @PostMapping
    public ResponseEntity<ApiResponse<Review>> addReview(
            @RequestBody Review review,
            @RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.extractUserId(authHeader.substring(7));
        review.setUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok("Review submitted!", reviewService.save(review)));
    }
}
