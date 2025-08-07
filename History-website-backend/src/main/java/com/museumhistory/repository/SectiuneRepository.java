package com.museumhistory.repository;

import com.museumhistory.model.Sectiune;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectiuneRepository extends JpaRepository<Sectiune, Integer> {
    Sectiune findByTitlu(String titlu);
}