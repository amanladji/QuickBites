package com.quickbite.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "newsletter_subscribers")
public class NewsletterSubscriber {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    @Builder.Default
    private boolean active = true;

    @CreatedDate
    private LocalDateTime subscribedAt;
}
