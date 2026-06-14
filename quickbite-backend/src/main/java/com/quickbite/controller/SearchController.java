package com.quickbite.controller;

import com.quickbite.dto.ApiResponse;
import com.quickbite.model.MenuItem;
import com.quickbite.model.Restaurant;
import com.quickbite.service.MenuItemService;
import com.quickbite.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final RestaurantService restaurantService;
    private final MenuItemService menuItemService;

    /**
     * GET /api/search?q=keyword
     * Returns both restaurants and menu items matching the keyword
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> search(
            @RequestParam("q") String keyword) {
        List<Restaurant> restaurants = restaurantService.search(keyword);
        List<MenuItem> menuItems = menuItemService.search(keyword);

        Map<String, Object> results = new HashMap<>();
        results.put("restaurants", restaurants);
        results.put("menuItems", menuItems);
        results.put("totalResults", restaurants.size() + menuItems.size());

        return ResponseEntity.ok(ApiResponse.ok(results));
    }
}
