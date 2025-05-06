package com.example.demo.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MuseumSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String seasonName; // "Vară" sau "Iarnă"
    
    private String weekdaysOpen;  // Ex: "09:00"
    private String weekdaysClose; // Ex: "17:00"
    
    private String weekendOpen;   // Ex: "10:00"
    private String weekendClose;  // Ex: "15:00"
    
    private String specialNotes;  // Observații speciale
    
    private boolean isActive;     // Dacă programul este activ
    
    // Lunile în care programul este valid (0 = Jan, 11 = Dec)
    @ElementCollection
    private List<Integer> validMonths;
}