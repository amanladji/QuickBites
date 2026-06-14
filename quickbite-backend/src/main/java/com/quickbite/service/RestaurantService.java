package com.quickbite.service;

import com.quickbite.exception.AppException;
import com.quickbite.model.Restaurant;
import com.quickbite.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepo;

    public List<Restaurant> getAll() {
        return restaurantRepo.findByIsOpenTrueOrderByTotalOrdersDesc();
    }

    public Restaurant getById(String id) {
        return restaurantRepo.findById(id)
                .orElseThrow(() -> new AppException("Restaurant not found"));
    }

    public List<Restaurant> getByArea(String area) {
        return restaurantRepo.findByAreaIgnoreCaseAndIsOpenTrue(area);
    }

    public List<Restaurant> getByCuisine(String cuisine) {
        return restaurantRepo.findByCuisinesContainingIgnoreCaseAndIsOpenTrue(cuisine);
    }

    public List<Restaurant> getNightOwl() {
        return restaurantRepo.findByIsNightOwlTrueAndIsOpenTrue();
    }

    public List<Restaurant> search(String keyword) {
        return restaurantRepo.searchByNameOrCuisine(keyword);
    }

    public Restaurant save(Restaurant restaurant) {
        return restaurantRepo.save(restaurant);
    }
}
