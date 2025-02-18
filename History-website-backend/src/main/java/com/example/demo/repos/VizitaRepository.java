package com.example.demo.repos;

import com.example.demo.models.Vizita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VizitaRepository extends JpaRepository<Vizita, Integer> {
}
