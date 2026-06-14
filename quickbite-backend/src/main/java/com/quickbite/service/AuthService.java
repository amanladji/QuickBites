package com.quickbite.service;

import com.quickbite.config.JwtUtil;
import com.quickbite.dto.AuthDto;
import com.quickbite.exception.AppException;
import com.quickbite.model.User;
import com.quickbite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new AppException("Email already registered. Please sign in.");
        }

        // Award referral coins if valid referral code provided
        int startCoins = 0;
        if (req.getReferralCode() != null && !req.getReferralCode().isBlank()) {
            userRepo.findByReferralCode(req.getReferralCode()).ifPresent(referrer -> {
                referrer.setQuickCoins(referrer.getQuickCoins() + 100);
                userRepo.save(referrer);
            });
            startCoins = 100; // new user also gets 100 coins for using referral
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .referralCode(generateReferralCode(req.getName()))
                .quickCoins(startCoins)
                .build();

        user = userRepo.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());
        return new AuthDto.AuthResponse(token, user.getId(), user.getName(),
                user.getEmail(), user.getRole(), user.getQuickCoins(), user.getLoyaltyTier());
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new AppException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());
        return new AuthDto.AuthResponse(token, user.getId(), user.getName(),
                user.getEmail(), user.getRole(), user.getQuickCoins(), user.getLoyaltyTier());
    }

    private String generateReferralCode(String name) {
        String prefix = name.replaceAll("[^A-Za-z]", "").toUpperCase();
        if (prefix.length() > 5) prefix = prefix.substring(0, 5);
        return prefix + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
}
