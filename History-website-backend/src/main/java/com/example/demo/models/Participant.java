package com.example.demo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "participanti")
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String nume;
    
    @Column(nullable = false)
    private String prenume;
    
    @Column(nullable = false, unique = false)
    private String email;
    
    @Column(name = "data_inscriere")
    private LocalDateTime dataInscriere;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eveniment_id", nullable = false)
    @JsonIgnore
    private Eveniment eveniment;
    
    @PrePersist
    public void prePersist() {
        this.dataInscriere = LocalDateTime.now();
    }
}