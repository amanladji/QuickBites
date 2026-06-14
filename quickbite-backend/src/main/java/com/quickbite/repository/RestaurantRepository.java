package com.quickbite.repository;

import com.quickbite.model.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface RestaurantRepository extends MongoRepository<Restaurant, String> {

    List<Restaurant> findByAreaIgnoreCaseAndIsOpenTrue(String area);

    List<Restaurant> findByCuisinesContainingIgnoreCaseAndIsOpenTrue(String cuisine);

    List<Restaurant> findByIsNightOwlTrueAndIsOpenTrue();

    List<Restaurant> findByIsOpenTrueOrderByTotalOrdersDesc();

    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Restaurant> searchByName(String keyword);

    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'cuisines': { $regex: ?0, $options: 'i' } } ] }")
    List<Restaurant> searchByNameOrCuisine(String keyword);
}
