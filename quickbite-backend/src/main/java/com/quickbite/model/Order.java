package com.quickbite.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String userId;
    private String restaurantId;
    private String restaurantName;

    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    private double subtotal;
    private double deliveryFee;
    private double discount;
    private double totalAmount;
    private String couponCode;
    private String deliveryAddress;
    private String deliveryType;

    @Builder.Default
    private String status = "PLACED";

    private String paymentMethod;

    @Builder.Default
    private boolean paymentDone = false;

    private int quickCoinsEarned;
    private String trackingId;

    @CreatedDate
    private LocalDateTime placedAt;

    private LocalDateTime estimatedDeliveryAt;
    private LocalDateTime deliveredAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItem {
        private String menuItemId;
        private String name;
        private int quantity;
        private double price;

        @JsonProperty("isVeg")
        private boolean isVeg;

        public boolean isVeg() { return isVeg; }

        @JsonProperty("isVeg")
        public void setVeg(boolean veg) { isVeg = veg; }
    }
}
