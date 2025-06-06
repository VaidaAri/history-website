package com.example.demo.services;

import com.example.demo.models.Eveniment;
import com.example.demo.repos.EvenimentRepository;
import com.example.demo.repos.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class EvenimentService {
    @Autowired
    EvenimentRepository evenimentRepository;
    
    @Autowired
    ParticipantRepository participantRepository;
    
    private static final int MAX_EVENTS_PER_DAY = 3;
    private static final int MAX_PARTICIPANTS_PER_EVENT = 100;

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

    /**
     * Calculează densitatea evenimentelor pentru calendar heat-map
     * @param year Anul pentru care se calculează
     * @param month Luna pentru care se calculează (1-12)
     * @return Map cu datele și densitatea pentru fiecare zi
     */
    public Map<String, Map<String, Object>> getEventDensityForMonth(int year, int month) {
        Map<String, Map<String, Object>> calendarData = new HashMap<>();
        
        // Calculăm prima și ultima zi a lunii
        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.withDayOfMonth(firstDay.lengthOfMonth());
        
        // Pentru fiecare zi din lună
        for (LocalDate date = firstDay; !date.isAfter(lastDay); date = date.plusDays(1)) {
            // Găsim toate evenimentele din această zi
            List<Eveniment> eventsOnDate = evenimentRepository.findEventsByDate(date);
            
            if (eventsOnDate.isEmpty()) {
                // Zi fără evenimente
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("status", "no-events");
                dayData.put("events", List.of());
                dayData.put("totalEvents", 0);
                calendarData.put(date.toString(), dayData);
                continue;
            }
            
            // Calculăm statusul pentru fiecare eveniment
            int totalEvents = eventsOnDate.size();
            int fullEvents = 0;
            int partialEvents = 0;
            int availableEvents = 0;
            
            List<Map<String, Object>> eventDetails = new java.util.ArrayList<>();
            
            for (Eveniment event : eventsOnDate) {
                long participantCount = participantRepository.countByEvenimentId(event.getId());
                double percentage = (double) participantCount / MAX_PARTICIPANTS_PER_EVENT * 100;
                
                String eventStatus;
                if (percentage >= 71) {
                    eventStatus = "full";
                    fullEvents++;
                } else if (percentage >= 31) {
                    eventStatus = "partial";
                    partialEvents++;
                } else {
                    eventStatus = "available";
                    availableEvents++;
                }
                
                Map<String, Object> eventInfo = new HashMap<>();
                eventInfo.put("id", event.getId());
                eventInfo.put("name", event.getName());
                eventInfo.put("participants", participantCount);
                eventInfo.put("capacity", MAX_PARTICIPANTS_PER_EVENT);
                eventInfo.put("percentage", Math.round(percentage));
                eventInfo.put("status", eventStatus);
                eventInfo.put("availableSpots", MAX_PARTICIPANTS_PER_EVENT - participantCount);
                
                eventDetails.add(eventInfo);
            }
            
            // Determinăm statusul general al zilei
            String dayStatus;
            if (fullEvents == totalEvents) {
                dayStatus = "full"; // Toate evenimentele sunt pline
            } else if (fullEvents > 0 || partialEvents >= Math.ceil(totalEvents / 2.0)) {
                dayStatus = "partial"; // Unele evenimente pline sau majoritatea parțiale
            } else {
                dayStatus = "available"; // Majoritatea evenimentelor au locuri disponibile
            }
            
            // Verificăm dacă data este în trecut
            if (date.isBefore(LocalDate.now())) {
                dayStatus = "past";
            }
            
            // Adăugăm în rezultat
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("status", dayStatus);
            dayData.put("events", eventDetails);
            dayData.put("totalEvents", totalEvents);
            dayData.put("fullEvents", fullEvents);
            dayData.put("partialEvents", partialEvents);
            dayData.put("availableEvents", availableEvents);
            dayData.put("totalAvailableSpots", 
                eventDetails.stream().mapToLong(e -> (Long) e.get("availableSpots")).sum());
            
            calendarData.put(date.toString(), dayData);
        }
        
        return calendarData;
    }
}
