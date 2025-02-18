package com.example.demo.controllers;

import com.example.demo.models.Eveniment;
import com.example.demo.services.EvenimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
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

    @PutMapping
    public void updateEvent(@RequestBody Eveniment updatedEvent){
        evenimentService.updateEvent(updatedEvent);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Integer id){
        evenimentService.deleteEvent(id);
    }
}
