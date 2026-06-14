package com.quickbite.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String userId;

    private String userName;

    private String userArea;

    private String restaurantId;

    private String orderId;

    private int rating;  // 1-5

    private String comment;

    @Builder.Default
    private boolean featured = false;  // show on homepage testimonials

    @CreatedDate
    private LocalDateTime createdAt;
}
