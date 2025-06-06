package com.example.demo.repos;

import com.example.demo.models.Eveniment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface EvenimentRepository extends JpaRepository<Eveniment, Integer> {
    
    @Query("SELECT COUNT(e) FROM Eveniment e WHERE DATE(e.startDate) = :date")
    long countEventsByDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(e) FROM Eveniment e WHERE DATE(e.startDate) = :date AND e.id != :eventId")
    long countEventsByDateExcludingEvent(@Param("date") LocalDate date, @Param("eventId") Integer eventId);
}
