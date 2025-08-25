package com.museumhistory.repository;

import com.museumhistory.model.Imagine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImagineRepository extends JpaRepository<Imagine, Integer> {
    List<Imagine> findAllByOrderByPositionAsc();
    List<Imagine> findAllByOrderByIdAsc(); // Fallback for existing queries
}
