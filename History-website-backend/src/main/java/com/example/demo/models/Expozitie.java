package com.example.demo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Expozitie extends Eveniment {
    
    public enum TipExpozitie {
        TEMPORARA,
        PERMANENTA
    }
    
    @Enumerated(EnumType.STRING)
    private TipExpozitie tip;
}