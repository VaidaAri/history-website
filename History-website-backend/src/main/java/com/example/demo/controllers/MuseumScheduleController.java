package com.example.demo.controllers;

import com.example.demo.models.MuseumSchedule;
import com.example.demo.services.MuseumScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/museum-schedule")
public class MuseumScheduleController {
    @Autowired
    private MuseumScheduleService scheduleService;
    
    @GetMapping("/current")
    public MuseumSchedule getCurrentSchedule() {
        return scheduleService.getCurrentSchedule();
    }
    
    @GetMapping
    public List<MuseumSchedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }
    
    @PutMapping("/{id}")
    public MuseumSchedule updateSchedule(@PathVariable Integer id, @RequestBody MuseumSchedule updatedSchedule) {
        if (!id.equals(updatedSchedule.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID-ul din path nu corespunde cu ID-ul din body");
        }
        return scheduleService.updateSchedule(updatedSchedule);
    }
}