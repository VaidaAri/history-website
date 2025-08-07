package com.museumhistory.repository;

import com.museumhistory.model.Administrator;
import com.museumhistory.model.Imagine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImagineRepository extends JpaRepository<Imagine, Integer> {
}
