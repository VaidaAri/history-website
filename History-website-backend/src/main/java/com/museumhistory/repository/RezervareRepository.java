package com.museumhistory.repository;

import com.museumhistory.model.Rezervare;
import com.museumhistory.model.Rezervare.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RezervareRepository extends JpaRepository<Rezervare, Integer> {
    int countByStatus(ReservationStatus status);
    @Query("SELECT COUNT(r) FROM Rezervare r WHERE DATE(r.datetime) = :date " +
           "AND HOUR(r.datetime) BETWEEN :startHour AND :endHour " +
           "AND r.status = 'CONFIRMATA'")
    int countConfirmedBookingsByDateAndTimeInterval(
            @Param("date") LocalDate date, 
            @Param("startHour") int startHour, 
            @Param("endHour") int endHour);
    Optional<Rezervare> findByConfirmationToken(String confirmationToken);
    List<Rezervare> findByStatusIn(List<ReservationStatus> statuses);
    
    // Find reservations where visit datetime + 24h is before current time
    @Query("SELECT r FROM Rezervare r WHERE r.datetime < :cutoffDateTime")
    List<Rezervare> findExpiredReservations(@Param("cutoffDateTime") LocalDateTime cutoffDateTime);
    
    // Delete reservations where visit datetime + 24h is before current time
    @Modifying
    @Query("DELETE FROM Rezervare r WHERE r.datetime < :cutoffDateTime")
    int deleteExpiredReservations(@Param("cutoffDateTime") LocalDateTime cutoffDateTime);
}
