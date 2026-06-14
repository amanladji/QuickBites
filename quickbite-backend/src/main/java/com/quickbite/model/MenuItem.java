package com.quickbite.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "menu_items")
public class MenuItem {

    @Id
    private String id;

    private String restaurantId;
    private String name;
    private String description;
    private double price;
    private String category;

    @JsonProperty("isVeg")
    private boolean isVeg;

    public boolean isVeg() { return isVeg; }

    @JsonProperty("isVeg")
    public void setVeg(boolean veg) { isVeg = veg; }

    private int calories;
    private int proteinGrams;
    private int carbsGrams;
    private String imageUrl;

    @Builder.Default
    private boolean available = true;

    @Builder.Default
    private int popularityScore = 0;

    @Builder.Default
    private List<String> badges = new ArrayList<>();
}
