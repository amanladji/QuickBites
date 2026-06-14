package com.quickbite.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank @Email(message = "Valid email required")
        private String email;

        @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String phone;

        private String referralCode;  // optional
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String userId;
        private String name;
        private String email;
        private String role;
        private int quickCoins;
        private String loyaltyTier;

        public AuthResponse(String token, String userId, String name,
                            String email, String role, int quickCoins, String loyaltyTier) {
            this.token = token;
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.role = role;
            this.quickCoins = quickCoins;
            this.loyaltyTier = loyaltyTier;
        }
    }
}
