package com.example.demo.repos;

import com.example.demo.models.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Integer> {
    
    List<Participant> findByEvenimentId(Integer evenimentId);
    
    @Query("SELECT p FROM Participant p WHERE p.eveniment.id = :evenimentId AND p.email = :email")
    Optional<Participant> findByEvenimentIdAndEmail(@Param("evenimentId") Integer evenimentId, @Param("email") String email);
    
    boolean existsByEvenimentIdAndEmail(Integer evenimentId, String email);
    
    long countByEvenimentId(Integer evenimentId);
}