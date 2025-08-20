package com.museumhistory.controller;

import com.museumhistory.model.Participant;
import com.museumhistory.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins = "http://localhost:4200")
public class ParticipantController {

    private static final Logger logger = LoggerFactory.getLogger(ParticipantController.class);
    
    @Autowired
    private ParticipantService participantService;
    
    @PostMapping("/inscriere")
    public ResponseEntity<Object> inscriereEveniment(@RequestBody Map<String, Object> request) {
        try {
            // Validate input
            if (request == null) {
                logger.warn("Attempt to register participant with null request data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele cererii nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Extract and validate evenimentId
            Integer evenimentId;
            Object evenimentIdObj = request.get("evenimentId");
            if (evenimentIdObj == null) {
                logger.warn("EvenimentId is missing from registration request");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul evenimentului este obligatoriu");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            try {
                if (evenimentIdObj instanceof String) {
                    evenimentId = Integer.parseInt((String) evenimentIdObj);
                } else if (evenimentIdObj instanceof Integer) {
                    evenimentId = (Integer) evenimentIdObj;
                } else {
                    throw new NumberFormatException("Invalid type for evenimentId");
                }
                
                if (evenimentId <= 0) {
                    logger.warn("Invalid evenimentId provided: {}", evenimentId);
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "ID-ul evenimentului trebuie să fie un număr pozitiv");
                    errorResponse.put("status", "error");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            } catch (NumberFormatException e) {
                logger.warn("Invalid evenimentId format: {}", evenimentIdObj);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul evenimentului trebuie să fie un număr valid");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Extract and validate other fields
            String nume = (String) request.get("nume");
            String prenume = (String) request.get("prenume");
            String email = (String) request.get("email");
            
            // Validate required fields
            Map<String, String> validationErrors = new HashMap<>();
            if (nume == null || nume.trim().isEmpty()) {
                validationErrors.put("nume", "Numele este obligatoriu");
            }
            if (prenume == null || prenume.trim().isEmpty()) {
                validationErrors.put("prenume", "Prenumele este obligatoriu");
            }
            if (email == null || email.trim().isEmpty()) {
                validationErrors.put("email", "Email-ul este obligatoriu");
            } else if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                validationErrors.put("email", "Formatul email-ului nu este valid");
            }
            
            if (!validationErrors.isEmpty()) {
                logger.warn("Validation failed for participant registration: {}", validationErrors);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele participantului nu sunt complete sau corecte");
                errorResponse.put("validationErrors", validationErrors);
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("Registering participant {} {} for event ID: {}", prenume, nume, evenimentId);
            
            Participant participant = participantService.inscriereEveniment(evenimentId, nume, prenume, email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Înscrierea s-a făcut cu succes! Veți primi un email de confirmare.");
            response.put("participant", participant);
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while registering participant", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Acest email este deja înregistrat pentru evenimentul specificat");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while registering participant", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la înregistrarea participantului. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/eveniment/{evenimentId}")
    public ResponseEntity<Object> getParticipantsByEveniment(@PathVariable Integer evenimentId) {
        try {
            if (evenimentId == null || evenimentId <= 0) {
                logger.warn("Invalid eveniment ID provided: {}", evenimentId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul evenimentului trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching participants for eveniment ID: {}", evenimentId);
            List<Participant> participants = participantService.getParticipantsByEveniment(evenimentId);
            
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            logger.error("Error fetching participants for eveniment ID: " + evenimentId, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-au putut încărca participanții pentru evenimentul specificat");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/count/{evenimentId}")
    public ResponseEntity<Object> getNumarParticipanti(@PathVariable Integer evenimentId) {
        try {
            if (evenimentId == null || evenimentId <= 0) {
                logger.warn("Invalid eveniment ID provided for count: {}", evenimentId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul evenimentului trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching participant count for eveniment ID: {}", evenimentId);
            long numarParticipanti = participantService.getNumarParticipanti(evenimentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("numarParticipanti", numarParticipanti);
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching participant count for eveniment ID: " + evenimentId, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-a putut încărca numărul de participanți pentru evenimentul specificat");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/verificare")
    public ResponseEntity<Object> verificareInscriere(
            @RequestParam Integer evenimentId, 
            @RequestParam String email) {
        try {
            // Validate evenimentId
            if (evenimentId == null || evenimentId <= 0) {
                logger.warn("Invalid eveniment ID provided for verification: {}", evenimentId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul evenimentului trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate email
            if (email == null || email.trim().isEmpty()) {
                logger.warn("Invalid email provided for verification: {}", email);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Email-ul este obligatoriu");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                logger.warn("Invalid email format provided for verification: {}", email);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Formatul email-ului nu este valid");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Verifying registration for eveniment ID: {} and email: {}", evenimentId, email);
            boolean esteInscris = participantService.esteInscris(evenimentId, email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("esteInscris", esteInscris);
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error verifying registration for eveniment ID: " + evenimentId + " and email: " + email, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-a putut verifica înregistrarea. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}