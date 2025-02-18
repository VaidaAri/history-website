package com.example.demo.repos;

import com.example.demo.models.Eveniment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvenimentRepository extends JpaRepository<Eveniment, Integer> {
}
