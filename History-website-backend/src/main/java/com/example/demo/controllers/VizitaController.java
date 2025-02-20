package com.example.demo.controllers;

import com.example.demo.models.Vizita;
import com.example.demo.services.VizitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
public class VizitaController {

    @Autowired
    private VizitaService vizitaService;

    @GetMapping
    public List<Vizita> getAllVisits(){
        return vizitaService.getAllVisits();
    }

    @GetMapping("/{id}")
    public Vizita getVisitById(@PathVariable Integer id){
        return vizitaService.findVisitById(id);
    }

    @PostMapping
    public void createVisit(@RequestBody Vizita newVisit){
        vizitaService.createVisit(newVisit);
    }

    @PutMapping
    public void updateVisit(@RequestBody Vizita updatedVisit){
        vizitaService.updateVisit(updatedVisit);
    }

    @DeleteMapping("/{id}")
    public void deleteVisit(@PathVariable Integer id){
        vizitaService.deleteVisit(id);
    }

}
