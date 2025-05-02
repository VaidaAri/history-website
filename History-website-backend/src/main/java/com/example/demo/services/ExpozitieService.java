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
    
    public List<Expozitie> getExhibitionsByTip(Expozitie.TipExpozitie tip) {
        return expozitieRepository.findByTip(tip);
    }

    public void createExhibition(Expozitie newExhibition){
        // Setează tipul TEMPORARA ca valoare implicită dacă nu este specificat
        if (newExhibition.getTip() == null) {
            newExhibition.setTip(Expozitie.TipExpozitie.TEMPORARA);
        }
        expozitieRepository.save(newExhibition);
    }

    public void updateExhibition(Expozitie updatedExhibition){
        // Verifică dacă expozitia există
        Expozitie existingExhibition = findExhibitionById(updatedExhibition.getId());
        
        // Păstrează tipul existent dacă nu este specificat în actualizare
        if (updatedExhibition.getTip() == null) {
            updatedExhibition.setTip(existingExhibition.getTip());
        }
        
        expozitieRepository.save(updatedExhibition);
    }

    public void deleteExhibition(Integer exhibitionId){
        expozitieRepository.deleteById(exhibitionId);
    }

    public Expozitie findExhibitionById(Integer exhibitionId){
        return expozitieRepository.findById(exhibitionId)
                .orElseThrow(()
                -> new RuntimeException("Nu s-a gasit expozitie cu ID-ul " + exhibitionId));
    }
}
