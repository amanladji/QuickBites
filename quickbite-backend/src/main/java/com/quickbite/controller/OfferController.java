package com.quickbite.controller;

import com.quickbite.config.JwtUtil;
import com.quickbite.dto.ApiResponse;
import com.quickbite.dto.OrderDto;
import com.quickbite.model.Offer;
import com.quickbite.service.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;
    private final JwtUtil jwtUtil;

    /** GET /api/offers */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Offer>>> getActiveOffers() {
        return ResponseEntity.ok(ApiResponse.ok(offerService.getActiveOffers()));
    }

    /** POST /api/offers/validate */
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<OrderDto.CouponValidateResponse>> validate(
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String code = (String) body.get("code");
        double cartTotal = Double.parseDouble(body.get("cartTotal").toString());
        String userId = "anonymous";
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            userId = jwtUtil.extractUserId(authHeader.substring(7));
        }
        return ResponseEntity.ok(ApiResponse.ok(offerService.validateCoupon(code, cartTotal, userId)));
    }
}
