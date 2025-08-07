package com.museumhistory.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Postare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "postare_id")
    private List<Imagine> images;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private LocalDateTime createdAt;
    
    @ManyToOne
    @JoinColumn(name = "sectiune_id")
    @JsonBackReference
    private Sectiune sectiune;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
