package com.quickbite.service;

import com.quickbite.dto.OrderDto;
import com.quickbite.model.Offer;
import com.quickbite.repository.OfferRepository;
import com.quickbite.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepo;
    private final OrderRepository orderRepo;

    public List<Offer> getActiveOffers() {
        return offerRepo.findByActiveTrue();
    }

    public OrderDto.CouponValidateResponse validateCoupon(String code, double cartTotal, String userId) {
        OrderDto.CouponValidateResponse resp = new OrderDto.CouponValidateResponse();

        Optional<Offer> opt = offerRepo.findByCodeIgnoreCase(code);
        if (opt.isEmpty()) {
            resp.setValid(false);
            resp.setMessage("Invalid coupon code.");
            return resp;
        }

        Offer offer = opt.get();

        if (!offer.isActive()) {
            resp.setValid(false); resp.setMessage("This offer has expired.");
            return resp;
        }
        if (offer.getValidUntil() != null && offer.getValidUntil().isBefore(LocalDateTime.now())) {
            resp.setValid(false); resp.setMessage("This offer has expired.");
            return resp;
        }
        if (cartTotal < offer.getMinOrderAmount()) {
            resp.setValid(false);
            resp.setMessage("Minimum order ₹" + (int) offer.getMinOrderAmount() + " required for this coupon.");
            return resp;
        }
        // NEW user check
        if ("NEW".equals(offer.getApplicableTo())) {
            long pastOrders = orderRepo.countByUserId(userId);
            if (pastOrders > 0) {
                resp.setValid(false);
                resp.setMessage("This offer is valid only on your first order.");
                return resp;
            }
        }

        double discount;
        if ("PERCENT".equals(offer.getDiscountType())) {
            discount = cartTotal * offer.getDiscountValue() / 100;
            discount = Math.min(discount, offer.getMaxDiscount());
        } else {
            discount = Math.min(offer.getDiscountValue(), offer.getMaxDiscount());
        }

        resp.setValid(true);
        resp.setMessage("Coupon applied! You save ₹" + (int) discount);
        resp.setDiscountAmount(discount);
        resp.setDiscountType(offer.getDiscountType());
        resp.setDiscountValue(offer.getDiscountValue());
        return resp;
    }
}
