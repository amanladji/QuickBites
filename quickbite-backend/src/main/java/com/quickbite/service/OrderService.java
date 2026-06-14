package com.quickbite.service;

import com.quickbite.dto.OrderDto;
import com.quickbite.exception.AppException;
import com.quickbite.model.*;
import com.quickbite.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    private final RestaurantRepository restaurantRepo;
    private final MenuItemRepository menuItemRepo;
    private final UserRepository userRepo;
    private final OfferService offerService;

    public Order placeOrder(OrderDto.PlaceOrderRequest req, String userId) {
        Restaurant restaurant = restaurantRepo.findById(req.getRestaurantId())
                .orElseThrow(() -> new AppException("Restaurant not found"));

        if (!restaurant.isOpen()) throw new AppException("Restaurant is currently closed");

        // Build order items
        List<Order.OrderItem> items = req.getItems().stream()
                .map(i -> Order.OrderItem.builder()
                        .menuItemId(i.getMenuItemId())
                        .name(i.getName())
                        .quantity(i.getQuantity())
                        .price(i.getPrice())
                        .isVeg(i.isVeg())
                        .build())
                .collect(Collectors.toList());

        double subtotal = items.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();

        double deliveryFee = subtotal >= 199 ? 0 : restaurant.getDeliveryFee();
        double discount = 0;

        // Apply coupon
        if (req.getCouponCode() != null && !req.getCouponCode().isBlank()) {
            OrderDto.CouponValidateResponse couponResp =
                    offerService.validateCoupon(req.getCouponCode(), subtotal, userId);
            if (couponResp.isValid()) discount = couponResp.getDiscountAmount();
        }

        double total = Math.max(0, subtotal + deliveryFee - discount);

        // Earn QuickCoins (10 per order)
        int coinsEarned = 10;
        userRepo.findById(userId).ifPresent(user -> {
            user.setQuickCoins(user.getQuickCoins() + coinsEarned);
            updateLoyaltyTier(user);
            userRepo.save(user);
        });

        // Increment restaurant order count
        restaurant.setTotalOrders(restaurant.getTotalOrders() + 1);
        restaurantRepo.save(restaurant);

        // Increment popularity of each menu item
        items.forEach(i -> menuItemRepo.findById(i.getMenuItemId()).ifPresent(menuItem -> {
            menuItem.setPopularityScore(menuItem.getPopularityScore() + i.getQuantity());
            menuItemRepo.save(menuItem);
        }));

        Order order = Order.builder()
                .userId(userId)
                .restaurantId(restaurant.getId())
                .restaurantName(restaurant.getName())
                .items(items)
                .subtotal(subtotal)
                .deliveryFee(deliveryFee)
                .discount(discount)
                .totalAmount(total)
                .couponCode(req.getCouponCode())
                .deliveryAddress(req.getDeliveryAddress())
                .deliveryType(req.getDeliveryType())
                .paymentMethod(req.getPaymentMethod())
                .quickCoinsEarned(coinsEarned)
                .trackingId(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .estimatedDeliveryAt(LocalDateTime.now().plusMinutes(restaurant.getDeliveryTimeMinutes()))
                .build();

        return orderRepo.save(order);
    }

    public List<Order> getUserOrders(String userId) {
        return orderRepo.findByUserIdOrderByPlacedAtDesc(userId);
    }

    public Order getOrderById(String orderId) {
        return orderRepo.findById(orderId)
                .orElseThrow(() -> new AppException("Order not found"));
    }

    public Order trackByTrackingId(String trackingId) {
        return orderRepo.findByTrackingId(trackingId)
                .orElseThrow(() -> new AppException("Tracking ID not found"));
    }

    public Order updateStatus(String orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        if ("DELIVERED".equals(status)) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        return orderRepo.save(order);
    }

    private void updateLoyaltyTier(User user) {
        long totalOrders = orderRepo.countByUserId(user.getId());
        if (totalOrders >= 50) user.setLoyaltyTier("GOLD");
        else if (totalOrders >= 15) user.setLoyaltyTier("SILVER");
        else user.setLoyaltyTier("BRONZE");
    }
}
