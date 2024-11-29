package com.example.demo.repos;

import com.example.demo.models.Postare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostareRepository extends JpaRepository<Postare, Integer> {
}
