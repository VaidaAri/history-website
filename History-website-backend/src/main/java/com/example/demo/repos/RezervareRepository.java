package com.example.demo.repos;

import com.example.demo.models.Rezervare;
import com.example.demo.models.Rezervare.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RezervareRepository extends JpaRepository<Rezervare, Integer> {
    int countByStatus(ReservationStatus status);
    
    // Numără rezervările aprobate pentru o anumită zi și interval orar
    @Query("SELECT COUNT(r) FROM Rezervare r WHERE DATE(r.datetime) = :date " +
           "AND HOUR(r.datetime) BETWEEN :startHour AND :endHour " +
           "AND r.status = 'APROBATA'")
    int countApprovedBookingsByDateAndTimeInterval(
            @Param("date") LocalDate date, 
            @Param("startHour") int startHour, 
            @Param("endHour") int endHour);
    
    // Găsește rezervarea după token-ul de confirmare
    Optional<Rezervare> findByConfirmationToken(String confirmationToken);
    
    // Găsește rezervările cu anumite statusuri
    List<Rezervare> findByStatusIn(List<ReservationStatus> statuses);
}
