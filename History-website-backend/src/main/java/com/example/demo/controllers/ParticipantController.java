package com.example.demo.controllers;

import com.example.demo.models.Participant;
import com.example.demo.services.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins = "http://localhost:4200")
public class ParticipantController {
    
    @Autowired
    private ParticipantService participantService;
    
    @PostMapping("/inscriere")
    public ResponseEntity<?> inscriereEveniment(@RequestBody Map<String, Object> request) {
        try {
            Integer evenimentId;
            Object evenimentIdObj = request.get("evenimentId");
            if (evenimentIdObj instanceof String) {
                evenimentId = Integer.parseInt((String) evenimentIdObj);
            } else if (evenimentIdObj instanceof Integer) {
                evenimentId = (Integer) evenimentIdObj;
            } else {
                throw new RuntimeException("evenimentId invalid");
            }
            
            String nume = (String) request.get("nume");
            String prenume = (String) request.get("prenume");
            String email = (String) request.get("email");
            
            
            if (evenimentId == null || nume == null || prenume == null || email == null) {
                throw new RuntimeException("Toate câmpurile sunt obligatorii");
            }
            
            Participant participant = participantService.inscriereEveniment(evenimentId, nume, prenume, email);
            
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", "Înscrierea s-a făcut cu succes! Veți primi un email de confirmare.",
                "participant", participant
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/eveniment/{evenimentId}")
    public List<Participant> getParticipantsByEveniment(@PathVariable Integer evenimentId) {
        return participantService.getParticipantsByEveniment(evenimentId);
    }
    
    @GetMapping("/count/{evenimentId}")
    public ResponseEntity<Map<String, Long>> getNumarParticipanti(@PathVariable Integer evenimentId) {
        long numarParticipanti = participantService.getNumarParticipanti(evenimentId);
        return ResponseEntity.ok(Map.of("numarParticipanti", numarParticipanti));
    }
    
    @GetMapping("/verificare")
    public ResponseEntity<Map<String, Boolean>> verificareInscriere(
            @RequestParam Integer evenimentId, 
            @RequestParam String email) {
        boolean esteInscris = participantService.esteInscris(evenimentId, email);
        return ResponseEntity.ok(Map.of("esteInscris", esteInscris));
    }
}