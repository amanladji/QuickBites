package com.quickbite.controller;

import com.quickbite.dto.ApiResponse;
import com.quickbite.model.MenuItem;
import com.quickbite.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuItemService menuItemService;

    /** GET /api/menu/trending */
    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getTrending() {
        return ResponseEntity.ok(ApiResponse.ok(menuItemService.getTrending()));
    }

    /** GET /api/menu/restaurant/{restaurantId} */
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getByRestaurant(
            @PathVariable String restaurantId) {
        return ResponseEntity.ok(ApiResponse.ok(menuItemService.getByRestaurant(restaurantId)));
    }

    /** GET /api/menu/category/{category} */
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.ok(menuItemService.getByCategory(category)));
    }

    /** POST /api/menu — Admin/Restaurant owner */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESTAURANT_OWNER')")
    public ResponseEntity<ApiResponse<MenuItem>> create(@RequestBody MenuItem item) {
        return ResponseEntity.ok(ApiResponse.ok("Menu item added!", menuItemService.save(item)));
    }
}
