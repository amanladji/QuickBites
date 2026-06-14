package com.quickbite.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "restaurants")
public class Restaurant {

    @Id
    private String id;

    private String name;

    private String description;

    @Builder.Default
    private List<String> cuisines = new ArrayList<>();

    private String area;       // e.g. "Koramangala"
    private String city;       // e.g. "Bangalore"
    private String address;

    private double rating;

    private int deliveryTimeMinutes;

    private int minOrderAmount;

    private int deliveryFee;

    @Builder.Default
    private boolean isOpen = true;

    @Builder.Default
    private boolean isNightOwl = false;   // open after midnight

    private String imageUrl;

    private String ownerId;  // links to User

    @Builder.Default
    private int totalOrders = 0;

    @Builder.Default
    private List<String> tags = new ArrayList<>(); // e.g. ["pure-veg","fssai"]

    @CreatedDate
    private LocalDateTime createdAt;
}
