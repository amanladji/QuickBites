package com.quickbite.config;

import com.quickbite.model.*;
import com.quickbite.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final RestaurantRepository restaurantRepo;
    private final MenuItemRepository menuItemRepo;
    private final OfferRepository offerRepo;
    private final ReviewRepository reviewRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) {
            log.info("Database already seeded — skipping.");
            return;
        }
        log.info("Seeding QuickBite database...");

        // ── Users ──────────────────────────────────────────────
        User admin = userRepo.save(User.builder()
                .name("QuickBite Admin")
                .email("admin@quickbite.in")
                .password(encoder.encode("Admin@123"))
                .role("ADMIN")
                .referralCode("ADMIN001")
                .quickCoins(0)
                .build());

        User customer = userRepo.save(User.builder()
                .name("Priya Sharma")
                .email("priya@example.com")
                .password(encoder.encode("Test@123"))
                .role("CUSTOMER")
                .phone("+91 98765 43210")
                .referralCode("PRIYA100")
                .quickCoins(250)
                .loyaltyTier("SILVER")
                .build());

        // ── Restaurants ────────────────────────────────────────
        Restaurant spiceGarden = restaurantRepo.save(Restaurant.builder()
                .name("The Spice Garden")
                .description("Authentic Indian & Mughlai cuisine since 2012. Famous for Butter Chicken.")
                .cuisines(List.of("Indian", "Mughlai"))
                .area("Koramangala")
                .city("Bangalore")
                .address("42, 5th Block, Koramangala, Bangalore — 560095")
                .rating(4.9)
                .deliveryTimeMinutes(25)
                .minOrderAmount(200)
                .deliveryFee(0)
                .totalOrders(3540)
                .isNightOwl(false)
                .imageUrl("https://placehold.co/400x250/E85D04/FFFFFF?text=🍛+The+Spice+Garden")
                .build());

        Restaurant bellaItalia = restaurantRepo.save(Restaurant.builder()
                .name("Bella Italia Ristorante")
                .description("Authentic Italian wood-fired pizzas and handmade pastas.")
                .cuisines(List.of("Italian", "Continental"))
                .area("Indiranagar")
                .city("Bangalore")
                .address("12, 100 Feet Road, Indiranagar, Bangalore — 560038")
                .rating(4.8)
                .deliveryTimeMinutes(30)
                .minOrderAmount(300)
                .deliveryFee(30)
                .totalOrders(3210)
                .imageUrl("https://placehold.co/400x250/16A34A/FFFFFF?text=🍕+Bella+Italia")
                .build());

        Restaurant burgerBarn = restaurantRepo.save(Restaurant.builder()
                .name("The Burger Barn")
                .description("Gourmet smash burgers crafted fresh every order.")
                .cuisines(List.of("American", "Fast Food"))
                .area("HSR Layout")
                .city("Bangalore")
                .address("8, Sector 1, HSR Layout, Bangalore — 560102")
                .rating(4.6)
                .deliveryTimeMinutes(20)
                .minOrderAmount(150)
                .deliveryFee(20)
                .totalOrders(2980)
                .isNightOwl(true)
                .imageUrl("https://placehold.co/400x250/FF6B35/FFFFFF?text=🍔+Burger+Barn")
                .build());

        Restaurant dragonPalace = restaurantRepo.save(Restaurant.builder()
                .name("Dragon Palace")
                .description("Pan-Asian cuisine — dim sum, noodles, and wok-fired delights.")
                .cuisines(List.of("Chinese", "Pan-Asian"))
                .area("Whitefield")
                .city("Bangalore")
                .address("3rd Floor, Phoenix Market City, Whitefield, Bangalore")
                .rating(4.7)
                .deliveryTimeMinutes(35)
                .minOrderAmount(250)
                .deliveryFee(40)
                .totalOrders(2750)
                .imageUrl("https://placehold.co/400x250/2563EB/FFFFFF?text=🥟+Dragon+Palace")
                .build());

        Restaurant midnightMunchies = restaurantRepo.save(Restaurant.builder()
                .name("Midnight Munchies")
                .description("Your late-night hunger saviour. Open till 4 AM!")
                .cuisines(List.of("Fast Food", "Burgers", "Sandwiches"))
                .area("BTM Layout")
                .city("Bangalore")
                .address("22, 2nd Stage, BTM Layout, Bangalore — 560076")
                .rating(4.4)
                .deliveryTimeMinutes(30)
                .minOrderAmount(150)
                .deliveryFee(25)
                .totalOrders(1890)
                .isNightOwl(true)
                .imageUrl("https://placehold.co/400x170/292524/F5F5F4?text=🌙+Midnight+Munchies")
                .build());

        // ── Menu Items ─────────────────────────────────────────
        // Spice Garden
        menuItemRepo.save(MenuItem.builder()
                .restaurantId(spiceGarden.getId())
                .name("Butter Chicken + Garlic Naan")
                .description("Slow-cooked chicken in velvety tomato-cream gravy with fresh garlic naan.")
                .price(329).category("Indian").isVeg(false)
                .calories(680).proteinGrams(42).carbsGrams(55)
                .popularityScore(920)
                .badges(List.of("best-seller"))
                .imageUrl("https://placehold.co/140x180/E85D04/FFFFFF?text=🍛")
                .build());

        menuItemRepo.save(MenuItem.builder()
                .restaurantId(spiceGarden.getId())
                .name("Chicken Biryani (Full)")
                .description("Dum-cooked basmati rice with tender chicken, saffron, and caramelised onions.")
                .price(289).category("Biryani").isVeg(false)
                .calories(750).proteinGrams(45).carbsGrams(85)
                .popularityScore(880)
                .badges(List.of("best-seller"))
                .imageUrl("https://placehold.co/140x180/E85D04/FFFFFF?text=🍱")
                .build());

        // Bella Italia
        menuItemRepo.save(MenuItem.builder()
                .restaurantId(bellaItalia.getId())
                .name("Margherita Pizza (Large)")
                .description("Wood-fired crust, San Marzano sauce, fresh buffalo mozzarella, basil.")
                .price(399).category("Pizza").isVeg(true)
                .calories(780).proteinGrams(32).carbsGrams(90)
                .popularityScore(890)
                .badges(List.of("pure-veg"))
                .imageUrl("https://placehold.co/140x180/16A34A/FFFFFF?text=🍕")
                .build());

        menuItemRepo.save(MenuItem.builder()
                .restaurantId(bellaItalia.getId())
                .name("Spaghetti Carbonara")
                .description("Al dente pasta, pancetta, egg yolk, Pecorino Romano, black pepper.")
                .price(349).category("Italian").isVeg(false)
                .calories(620).proteinGrams(28).carbsGrams(72)
                .popularityScore(750)
                .badges(List.of("chefs-pick"))
                .imageUrl("https://placehold.co/140x180/16A34A/FFFFFF?text=🍝")
                .build());

        // Burger Barn
        menuItemRepo.save(MenuItem.builder()
                .restaurantId(burgerBarn.getId())
                .name("Double Smash Burger")
                .description("Double beef patty, aged cheddar, caramelised onions, pickles, secret sauce.")
                .price(249).category("Burgers").isVeg(false)
                .calories(520).proteinGrams(28).carbsGrams(42)
                .popularityScore(950)
                .badges(List.of("trending"))
                .imageUrl("https://placehold.co/140x180/FF6B35/FFFFFF?text=🍔")
                .build());

        // Dragon Palace
        menuItemRepo.save(MenuItem.builder()
                .restaurantId(dragonPalace.getId())
                .name("Steamed Dim Sum Basket (8 pcs)")
                .description("Handcrafted dim sums — har gow, mushroom shumai, truffle edamame.")
                .price(279).category("Chinese").isVeg(true)
                .calories(360).proteinGrams(18).carbsGrams(40)
                .popularityScore(840)
                .badges(List.of("chefs-pick", "new"))
                .imageUrl("https://placehold.co/140x180/2563EB/FFFFFF?text=🥟")
                .build());

        // ── Offers ─────────────────────────────────────────────
        offerRepo.save(Offer.builder()
                .title("50% OFF Your First Order!")
                .subtitle("Valid on all restaurants. Max discount ₹150.")
                .code("FIRST50")
                .discountType("PERCENT")
                .discountValue(50)
                .maxDiscount(150)
                .minOrderAmount(100)
                .applicableTo("NEW")
                .badgeColor("orange")
                .emoji("🎉")
                .validUntil(LocalDateTime.now().plusMonths(12))
                .build());

        offerRepo.save(Offer.builder()
                .title("Happy Hours — 20% Off")
                .subtitle("2 PM – 5 PM: Extra 20% off every day.")
                .code("HAPPY20")
                .discountType("PERCENT")
                .discountValue(20)
                .maxDiscount(100)
                .minOrderAmount(199)
                .badgeColor("amber")
                .emoji("⏰")
                .validUntil(LocalDateTime.now().plusMonths(6))
                .build());

        offerRepo.save(Offer.builder()
                .title("Free Delivery")
                .subtitle("On orders above ₹199. No code needed!")
                .code("FREEDEL")
                .discountType("FLAT")
                .discountValue(40)
                .maxDiscount(40)
                .minOrderAmount(199)
                .badgeColor("green")
                .emoji("🛵")
                .validUntil(LocalDateTime.now().plusMonths(3))
                .build());

        // ── Reviews ────────────────────────────────────────────
        reviewRepo.save(Review.builder()
                .userId(customer.getId())
                .userName("Priya Sharma")
                .userArea("Koramangala")
                .restaurantId(spiceGarden.getId())
                .rating(5)
                .comment("QuickBite is absolutely incredible. My butter chicken arrived in 22 minutes, piping hot!")
                .featured(true)
                .build());

        reviewRepo.save(Review.builder()
                .userId(customer.getId())
                .userName("Rahul Verma")
                .userArea("Indiranagar")
                .restaurantId(bellaItalia.getId())
                .rating(5)
                .comment("Ordered pizza for the first time — it's like eating at the actual restaurant. Insane quality!")
                .featured(true)
                .build());

        reviewRepo.save(Review.builder()
                .userId(customer.getId())
                .userName("Sneha Nair")
                .userArea("Whitefield")
                .restaurantId(dragonPalace.getId())
                .rating(5)
                .comment("The live tracking is so smooth. I watched my order move on the map! Delivered in exactly 18 mins.")
                .featured(true)
                .build());

        log.info("✅ Database seeded successfully with restaurants, menus, offers & reviews.");
    }
}
