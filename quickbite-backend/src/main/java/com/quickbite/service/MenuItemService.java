package com.quickbite.service;

import com.quickbite.model.MenuItem;
import com.quickbite.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepo;

    public List<MenuItem> getByRestaurant(String restaurantId) {
        return menuItemRepo.findByRestaurantIdAndAvailableTrue(restaurantId);
    }

    public List<MenuItem> getByCategory(String category) {
        return menuItemRepo.findByCategoryIgnoreCaseAndAvailableTrue(category);
    }

    public List<MenuItem> getTrending() {
        return menuItemRepo.findByAvailableTrueOrderByPopularityScoreDesc()
                .stream().limit(8).toList();
    }

    public List<MenuItem> search(String keyword) {
        return menuItemRepo.searchByNameOrDescription(keyword);
    }

    public MenuItem save(MenuItem item) {
        return menuItemRepo.save(item);
    }
}
