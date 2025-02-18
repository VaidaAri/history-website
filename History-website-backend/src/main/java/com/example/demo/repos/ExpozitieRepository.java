package com.example.demo.repos;

import com.example.demo.models.Expozitie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpozitieRepository extends JpaRepository<Expozitie, Integer> {
}
