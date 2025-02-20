package com.example.demo.controllers;

import com.example.demo.models.Expozitie;
import com.example.demo.services.ExpozitieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exhibitions")
public class ExpozitieController {

    @Autowired
    private ExpozitieService expozitieService;

    @GetMapping
    public List<Expozitie> getAllExhibitions(){
        return expozitieService.getAllExhibitions();
    }

    @GetMapping("/{id}")
    public Expozitie getAllExhibitionbyId(@PathVariable Integer id){
        return expozitieService.findExhibitionById(id);
    }

    @PostMapping
    public void createExhibition(@RequestBody Expozitie newExhibition){
        expozitieService.createExhibition(newExhibition);
    }

    @PutMapping
    public void updateExhibition(@RequestBody Expozitie updatedExhibition){
        expozitieService.updateExhibition(updatedExhibition);
    }

    @DeleteMapping("/{id}")
    public void deleteExhibition(@PathVariable Integer id){
        expozitieService.deleteExhibition(id);
    }


}
