package com.example.demo.controllers;

import com.example.demo.models.Administrator;
import com.example.demo.services.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/administrators")
public class AdministratorController {

    @Autowired
    private AdministratorService administratorService;

    @GetMapping
    public List<Administrator> getAllAdministrators(){
        return administratorService.getAllAdministrators();
    }

    @GetMapping("/{id}")
    public Administrator getAdministratorById(@PathVariable Integer id){
        return administratorService.findAdministratorById(id);
    }

    @PostMapping
    public void createAdministrator(@RequestBody Administrator newAdministrator) {
        administratorService.createAdministrator(newAdministrator);
    }

    @PutMapping
    public void updateAdministrator(@RequestBody Administrator updatedAdministrator){
        administratorService.updateAdministrator(updatedAdministrator);
    }

    @DeleteMapping("/{id}")
    public void deleteActivity(@PathVariable Integer id){
        administratorService.deleteAdministrator(id);
    }
}
