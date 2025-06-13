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
    
    private String seasonName;
    
    private String weekdaysOpen;
    private String weekdaysClose;
    
    private String weekendOpen;
    private String weekendClose;
    
    private String specialNotes;
    
    private boolean isActive;
    
    @ElementCollection
    private List<Integer> validMonths;
}