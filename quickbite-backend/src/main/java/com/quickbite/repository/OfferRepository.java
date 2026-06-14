package com.quickbite.repository;

import com.quickbite.model.Offer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface OfferRepository extends MongoRepository<Offer, String> {
    Optional<Offer> findByCodeIgnoreCase(String code);
    List<Offer> findByActiveTrue();
}
