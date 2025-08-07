package com.museumhistory.service;

import com.museumhistory.model.Expozitie;
import com.museumhistory.repository.ExpozitieRepository;
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
        if (newExhibition.getTip() == null) {
            newExhibition.setTip(Expozitie.TipExpozitie.TEMPORARA);
        }
        expozitieRepository.save(newExhibition);
    }

    public void updateExhibition(Expozitie updatedExhibition){
        Expozitie existingExhibition = findExhibitionById(updatedExhibition.getId());
        
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
