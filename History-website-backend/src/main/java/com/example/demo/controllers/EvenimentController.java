package com.example.demo.controllers;

import com.example.demo.models.Eveniment;
import com.example.demo.services.EvenimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:4200")
public class EvenimentController {

    @Autowired
    private EvenimentService evenimentService;

    @GetMapping
    public List<Eveniment> getAllEvents(){
        try {
            System.out.println("Getting all events...");
            List<Eveniment> events = evenimentService.getAllEvents();
            System.out.println("Found " + events.size() + " events");
            return events;
        } catch (Exception e) {
            System.err.println("Error getting events: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/{id}")
    public Eveniment getEventById(@PathVariable Integer id){
        return evenimentService.findEventById(id);
    }

    @PostMapping
    public void createEvent(@RequestBody Eveniment newEvent){
        evenimentService.createEvent(newEvent);
    }

    @PutMapping("/{id}")
    public void updateEvent(@PathVariable Integer id, @RequestBody Eveniment updatedEvent){
        updatedEvent.setId(id);
        evenimentService.updateEvent(updatedEvent);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Integer id){
        evenimentService.deleteEvent(id);
    }

    @GetMapping("/calendar-density/{year}/{month}")
    public Map<String, Map<String, Object>> getEventDensity(@PathVariable int year, @PathVariable int month) {
        try {
            System.out.println("Getting event density for " + year + "/" + month);
            Map<String, Map<String, Object>> density = evenimentService.getEventDensityForMonth(year, month);
            System.out.println("Calculated density for " + density.size() + " days");
            return density;
        } catch (Exception e) {
            System.err.println("Error calculating event density: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
