package com.quickbite.service;

import com.quickbite.model.NewsletterSubscriber;
import com.quickbite.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterSubscriberRepository repo;

    public String subscribe(String email) {
        if (repo.existsByEmail(email)) {
            return "You're already subscribed! 🎉";
        }
        repo.save(NewsletterSubscriber.builder().email(email).build());
        return "Subscribed successfully! Welcome to QuickBite updates 🎉";
    }

    public String unsubscribe(String email) {
        repo.findByEmail(email).ifPresent(s -> {
            s.setActive(false);
            repo.save(s);
        });
        return "You've been unsubscribed.";
    }
}
