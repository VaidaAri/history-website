package com.example.demo.repos;

import com.example.demo.models.Sectiune;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectiuneRepository extends JpaRepository<Sectiune, Integer> {
    Sectiune findByTitlu(String titlu);
}