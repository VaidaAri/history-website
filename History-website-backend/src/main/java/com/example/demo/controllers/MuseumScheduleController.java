package com.example.demo.controllers;

import com.example.demo.models.MuseumSchedule;
import com.example.demo.services.MuseumScheduleService;
import com.example.demo.repos.MuseumScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/museum-schedule")
public class MuseumScheduleController {
    @Autowired
    private MuseumScheduleService scheduleService;
    
    @Autowired
    private MuseumScheduleRepository scheduleRepository;
    
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
    
    @GetMapping("/update-summer-text")
    public Map<String, String> updateSummerText() {
        Map<String, String> response = new HashMap<>();
        
        try {
            List<MuseumSchedule> allSchedules = scheduleRepository.findAll();
            
            for (MuseumSchedule schedule : allSchedules) {
                if ("Vară".equals(schedule.getSeasonName())) {
                    schedule.setSpecialNotes("Muzeul este ÎNCHIS LUNEA pentru activități administrative.");
                    scheduleRepository.save(schedule);
                    
                    response.put("status", "success");
                    response.put("message", "Textul pentru programul de vară a fost actualizat cu succes!");
                    response.put("oldText", "Muzeul este ÎNCHIS LUNEA pentru activități administrative. Ultima intrare cu 30 de minute înainte de închidere.");
                    response.put("newText", schedule.getSpecialNotes());
                    return response;
                }
            }
            
            response.put("status", "error");
            response.put("message", "Nu s-a găsit programul de vară în baza de date.");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Eroare la actualizarea textului: " + e.getMessage());
        }
        
        return response;
    }
}