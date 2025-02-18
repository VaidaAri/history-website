package com.example.demo.services;

import com.example.demo.models.Eveniment;
import com.example.demo.repos.EvenimentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvenimentService {
    @Autowired
    EvenimentRepository evenimentRepository;

    public List<Eveniment> getAllEvents(){
        return evenimentRepository.findAll();
    }

    public void createEvent(Eveniment newEvent){
        evenimentRepository.save(newEvent);
    }

    public void updateEvent(Eveniment updatedEvent){
        evenimentRepository.save(updatedEvent);
    }

    public void deleteEvent(Integer eventId){
        evenimentRepository.deleteById(eventId);
    }

    public Eveniment findEventById(Integer eventId){
        return evenimentRepository.findById(eventId)
                .orElseThrow(()
                -> new RuntimeException("Nu s-a gasit eveniment cu ID-ul:" + eventId));
    }
}
