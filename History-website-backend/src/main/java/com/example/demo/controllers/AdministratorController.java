package com.example.demo.controllers;

import com.example.demo.models.Administrator;
import com.example.demo.services.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        boolean isAuthenticated = administratorService.authenticate(username, password);
        if (isAuthenticated) {
            return ResponseEntity.ok("Autentificare reușită!");
        } else {
            return ResponseEntity.status(401).body("Eroare: Nume de utilizator sau parolă incorectă!");
        }
    }
}
