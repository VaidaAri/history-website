package com.example.demo.repos;

import com.example.demo.models.Rezervare;
import com.example.demo.models.Rezervare.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RezervareRepository extends JpaRepository<Rezervare, Integer> {
    int countByStatus(ReservationStatus status);
}
