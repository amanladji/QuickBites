package com.quickbite.controller;

import com.quickbite.dto.ApiResponse;
import com.quickbite.service.NewsletterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterService newsletterService;

    /** POST /api/newsletter/subscribe */
    @PostMapping("/subscribe")
    public ResponseEntity<ApiResponse<String>> subscribe(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));
        }
        return ResponseEntity.ok(ApiResponse.ok(newsletterService.subscribe(email)));
    }

    /** POST /api/newsletter/unsubscribe */
    @PostMapping("/unsubscribe")
    public ResponseEntity<ApiResponse<String>> unsubscribe(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok(newsletterService.unsubscribe(body.get("email"))));
    }
}
