package com.quickbite.repository;

import com.quickbite.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByRestaurantId(String restaurantId);
    List<Review> findByFeaturedTrue();
    List<Review> findByUserId(String userId);
}
