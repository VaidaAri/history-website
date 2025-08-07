package com.museumhistory.repository;

import com.museumhistory.model.Expozitie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpozitieRepository extends JpaRepository<Expozitie, Integer> {
    List<Expozitie> findByTip(Expozitie.TipExpozitie tip);
}
