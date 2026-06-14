package com.quickbite.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "offers")
public class Offer {

    @Id
    private String id;

    private String title;

    private String subtitle;

    @Indexed(unique = true)
    private String code;           // e.g. "FIRST50"

    private String discountType;   // "PERCENT" | "FLAT"

    private double discountValue;  // 50 (%) or 150 (flat ₹)

    private double maxDiscount;    // max ₹ cap

    private double minOrderAmount; // minimum cart value

    @Builder.Default
    private boolean active = true;

    private LocalDateTime validUntil;

    private String badgeColor;    // "orange" | "green" | "amber"

    private String emoji;

    // null = all users, "NEW" = first-order only
    private String applicableTo;
}
