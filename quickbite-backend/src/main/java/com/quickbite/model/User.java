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
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password; // BCrypt hashed

    private String phone;

    @Builder.Default
    private String role = "CUSTOMER"; // CUSTOMER | ADMIN | RESTAURANT_OWNER

    @Builder.Default
    private int quickCoins = 0;

    @Builder.Default
    private String loyaltyTier = "BRONZE"; // BRONZE | SILVER | GOLD

    @Builder.Default
    private List<String> savedAddresses = new ArrayList<>();

    private String referralCode;

    @Builder.Default
    private List<String> appliedReferrals = new ArrayList<>();

    @Builder.Default
    private boolean active = true;

    @CreatedDate
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
