package com.example.demo.services;

import com.example.demo.models.Vizita;
import com.example.demo.repos.VizitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VizitaService {
    @Autowired
    VizitaRepository vizitaRepository;

    public List<Vizita> getAllVisits(){
        return vizitaRepository.findAll();
    }

    public void createVisit(Vizita newVisit){
        vizitaRepository.save(newVisit);
    }

    public void updateVisit(Vizita upatedVisit){
        vizitaRepository.save(upatedVisit);
    }

    public void deleteVisit(Integer visitId){
        vizitaRepository.deleteById(visitId);
    }

    public Vizita findVisitById(Integer visitId){
        return vizitaRepository.findById(visitId)
                .orElseThrow(()
                -> new RuntimeException("Nu s-a gasit vizita cu ID-ul" + visitId));
    }
}
