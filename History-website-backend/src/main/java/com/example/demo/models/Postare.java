package com.example.demo.models;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Postare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToMany
    private List<Imagine> images;
    private String text;
}
