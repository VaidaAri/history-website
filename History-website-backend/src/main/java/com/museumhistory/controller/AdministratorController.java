package com.museumhistory.controller;

import com.museumhistory.model.Administrator;
import com.museumhistory.service.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
    public void deleteAdministrator(@PathVariable Integer id){
        administratorService.deleteAdministrator(id);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        boolean isAuthenticated = administratorService.authenticate(username, password);
        
        if (isAuthenticated) {
            String token = generateSimpleToken(username);
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(401).body("Eroare: Nume de utilizator sau parolă incorectă!");
        }
    }
    
    @GetMapping("/validate-token")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }
    
    private String generateSimpleToken(String username) {
        String tokenId = UUID.randomUUID().toString();
        String timestamp = String.valueOf(new Date().getTime());
        String tokenData = username + ":" + timestamp + ":" + tokenId;
        return Base64.getEncoder().encodeToString(tokenData.getBytes());
    }
}
