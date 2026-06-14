package com.quickbite.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

public class OrderDto {

    @Data
    public static class PlaceOrderRequest {
        @NotEmpty(message = "Cart cannot be empty")
        private List<CartItem> items;

        @NotBlank(message = "Restaurant ID required")
        private String restaurantId;

        @NotBlank(message = "Delivery address required")
        private String deliveryAddress;

        private String deliveryType = "DELIVERY";

        private String couponCode;

        private String paymentMethod = "COD";
    }

    @Data
    public static class CartItem {
        private String menuItemId;
        private String name;
        @Min(1)
        private int quantity;
        private double price;

        // Fix: Jackson maps "isVeg" JSON field correctly
        @JsonProperty("isVeg")
        private boolean isVeg;

        public boolean isVeg() { return isVeg; }

        @JsonProperty("isVeg")
        public void setVeg(boolean veg) { isVeg = veg; }
    }

    @Data
    public static class CouponValidateRequest {
        @NotBlank
        private String code;
        private double cartTotal;
        private String userId;
    }

    @Data
    public static class CouponValidateResponse {
        private boolean valid;
        private String message;
        private double discountAmount;
        private String discountType;
        private double discountValue;
    }
}
