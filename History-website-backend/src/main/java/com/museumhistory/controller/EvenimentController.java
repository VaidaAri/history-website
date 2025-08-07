package com.museumhistory.controller;

import com.museumhistory.model.Eveniment;
import com.museumhistory.service.EvenimentService;
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
        return evenimentService.getAllEvents();
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
        return evenimentService.getEventDensityForMonth(year, month);
    }
}
