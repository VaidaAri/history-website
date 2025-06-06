package com.example.demo.services;

import com.example.demo.models.Eveniment;
import com.example.demo.repos.EvenimentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EvenimentService {
    @Autowired
    EvenimentRepository evenimentRepository;
    
    private static final int MAX_EVENTS_PER_DAY = 3;

    public List<Eveniment> getAllEvents(){
        return evenimentRepository.findAll();
    }

    public void createEvent(Eveniment newEvent){
        LocalDate eventDate = newEvent.getStartDate().toLocalDate();
        long existingEventsCount = evenimentRepository.countEventsByDate(eventDate);
        
        if (existingEventsCount >= MAX_EVENTS_PER_DAY) {
            throw new RuntimeException("Limita maxima de " + MAX_EVENTS_PER_DAY + " evenimente pe zi a fost atinsa pentru data " + eventDate);
        }
        
        evenimentRepository.save(newEvent);
    }

    public void updateEvent(Eveniment updatedEvent){
        LocalDate eventDate = updatedEvent.getStartDate().toLocalDate();
        long existingEventsCount = evenimentRepository.countEventsByDateExcludingEvent(eventDate, updatedEvent.getId());
        
        if (existingEventsCount >= MAX_EVENTS_PER_DAY) {
            throw new RuntimeException("Limita maxima de " + MAX_EVENTS_PER_DAY + " evenimente pe zi a fost atinsa pentru data " + eventDate);
        }
        
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
