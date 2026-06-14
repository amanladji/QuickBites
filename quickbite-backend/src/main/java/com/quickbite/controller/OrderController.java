package com.quickbite.controller;

import com.quickbite.config.JwtUtil;
import com.quickbite.dto.ApiResponse;
import com.quickbite.dto.OrderDto;
import com.quickbite.model.Order;
import com.quickbite.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    /** POST /api/orders — place an order (authenticated) */
    @PostMapping
    public ResponseEntity<ApiResponse<Order>> placeOrder(
            @Valid @RequestBody OrderDto.PlaceOrderRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        Order order = orderService.placeOrder(req, userId);
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully! 🎉", order));
    }

    /** GET /api/orders/my — current user's orders */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        return ResponseEntity.ok(ApiResponse.ok(orderService.getUserOrders(userId)));
    }

    /** GET /api/orders/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderById(id)));
    }

    /** GET /api/orders/track/{trackingId} — public */
    @GetMapping("/track/{trackingId}")
    public ResponseEntity<ApiResponse<Order>> track(@PathVariable String trackingId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.trackByTrackingId(trackingId)));
    }

    /** PATCH /api/orders/{id}/status — Admin/Restaurant only */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESTAURANT_OWNER')")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated",
                orderService.updateStatus(id, body.get("status"))));
    }

    private String extractUserId(String authHeader) {
        return jwtUtil.extractUserId(authHeader.substring(7));
    }
}
