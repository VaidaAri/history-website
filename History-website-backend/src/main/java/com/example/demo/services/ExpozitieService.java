package com.example.demo.services;

import com.example.demo.models.Expozitie;
import com.example.demo.repos.ExpozitieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpozitieService {
    @Autowired
    ExpozitieRepository expozitieRepository;

    public List<Expozitie> getAllExhibitions(){
        return expozitieRepository.findAll();
    }

    public void createExhibition(Expozitie newExhibition){
        expozitieRepository.save(newExhibition);
    }

    public void updateExhibition(Expozitie updatedExhibition){
        expozitieRepository.save(updatedExhibition);
    }

    public void deleteExhibition(Integer exhibitionId){
        expozitieRepository.deleteById(exhibitionId);
    }

    public Expozitie findExhibitionById(Integer exhibitionId){
        return expozitieRepository.findById(exhibitionId)
                .orElseThrow(()
                -> new RuntimeException("Nu s-a gasit expozitie cu ID-ul" + exhibitionId));
    }
}
