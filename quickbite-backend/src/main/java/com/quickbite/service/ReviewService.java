package com.quickbite.service;

import com.quickbite.exception.AppException;
import com.quickbite.model.NewsletterSubscriber;
import com.quickbite.model.Review;
import com.quickbite.repository.NewsletterSubscriberRepository;
import com.quickbite.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepo;

    public List<Review> getFeatured() {
        return reviewRepo.findByFeaturedTrue();
    }

    public List<Review> getByRestaurant(String restaurantId) {
        return reviewRepo.findByRestaurantId(restaurantId);
    }

    public Review save(Review review) {
        return reviewRepo.save(review);
    }
}
