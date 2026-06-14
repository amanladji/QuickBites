package com.quickbite.controller;

import com.quickbite.dto.ApiResponse;
import com.quickbite.model.Restaurant;
import com.quickbite.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    /** GET /api/restaurants — all open restaurants sorted by popularity */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Restaurant>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(restaurantService.getAll()));
    }

    /** GET /api/restaurants/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Restaurant>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(restaurantService.getById(id)));
    }

    /** GET /api/restaurants/area/{area} */
    @GetMapping("/area/{area}")
    public ResponseEntity<ApiResponse<List<Restaurant>>> getByArea(@PathVariable String area) {
        return ResponseEntity.ok(ApiResponse.ok(restaurantService.getByArea(area)));
    }

    /** GET /api/restaurants/cuisine/{cuisine} */
    @GetMapping("/cuisine/{cuisine}")
    public ResponseEntity<ApiResponse<List<Restaurant>>> getByCuisine(@PathVariable String cuisine) {
        return ResponseEntity.ok(ApiResponse.ok(restaurantService.getByCuisine(cuisine)));
    }

    /** GET /api/restaurants/night-owl */
    @GetMapping("/night-owl")
    public ResponseEntity<ApiResponse<List<Restaurant>>> getNightOwl() {
        return ResponseEntity.ok(ApiResponse.ok(restaurantService.getNightOwl()));
    }

    /** POST /api/restaurants — Admin only */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Restaurant>> create(@RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(ApiResponse.ok("Restaurant added!", restaurantService.save(restaurant)));
    }

    /** PUT /api/restaurants/{id} — Admin only */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Restaurant>> update(
            @PathVariable String id, @RequestBody Restaurant restaurant) {
        restaurant.setId(id);
        return ResponseEntity.ok(ApiResponse.ok("Restaurant updated!", restaurantService.save(restaurant)));
    }
}
