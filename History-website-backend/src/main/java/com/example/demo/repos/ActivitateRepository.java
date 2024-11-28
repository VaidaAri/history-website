package com.example.demo.repos;

import com.example.demo.models.Activitate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivitateRepository extends JpaRepository<Activitate, Integer> {
}
