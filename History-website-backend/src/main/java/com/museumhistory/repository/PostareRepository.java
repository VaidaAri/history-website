package com.museumhistory.repository;

import com.museumhistory.model.Postare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostareRepository extends JpaRepository<Postare, Integer> {
}
