package com.quickbite.repository;

import com.quickbite.model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MenuItemRepository extends MongoRepository<MenuItem, String> {

    List<MenuItem> findByRestaurantIdAndAvailableTrue(String restaurantId);

    List<MenuItem> findByCategoryIgnoreCaseAndAvailableTrue(String category);

    List<MenuItem> findByAvailableTrueOrderByPopularityScoreDesc();

    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    List<MenuItem> searchByNameOrDescription(String keyword);

    List<MenuItem> findByRestaurantIdAndCategoryIgnoreCaseAndAvailableTrue(String restaurantId, String category);
}
