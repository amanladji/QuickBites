package com.quickbite.repository;

import com.quickbite.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByUserIdOrderByPlacedAtDesc(String userId);

    List<Order> findByRestaurantIdOrderByPlacedAtDesc(String restaurantId);

    Optional<Order> findByTrackingId(String trackingId);

    List<Order> findByStatus(String status);

    long countByUserId(String userId);
}
