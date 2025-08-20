package com.museumhistory.controller;

import com.museumhistory.model.Expozitie;
import com.museumhistory.service.ExpozitieService;
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
@RequestMapping("/api/exhibitions")
public class ExpozitieController {

    private static final Logger logger = LoggerFactory.getLogger(ExpozitieController.class);

    @Autowired
    private ExpozitieService expozitieService;

    @GetMapping
    public ResponseEntity<Object> getAllExhibitions(
            @RequestParam(required = false) Expozitie.TipExpozitie tip){
        try {
            logger.debug("Fetching exhibitions with tip: {}", tip);
            List<Expozitie> exhibitions;
            if (tip != null) {
                exhibitions = expozitieService.getExhibitionsByTip(tip);
            } else {
                exhibitions = expozitieService.getAllExhibitions();
            }
            return ResponseEntity.ok(exhibitions);
        } catch (Exception e) {
            logger.error("Error fetching exhibitions", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-au putut încărca expozițiile");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getAllExhibitionbyId(@PathVariable Integer id){
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid exhibition ID provided: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul expoziției trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching exhibition with ID: {}", id);
            Expozitie exhibition = expozitieService.findExhibitionById(id);
            
            if (exhibition == null) {
                logger.warn("Exhibition not found with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Expoziția cu ID-ul " + id + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            return ResponseEntity.ok(exhibition);
        } catch (Exception e) {
            logger.error("Error fetching exhibition with ID: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la căutarea expoziției");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createExhibition(@RequestBody Expozitie newExhibition){
        try {
            // Validate input
            if (newExhibition == null) {
                logger.warn("Attempt to create exhibition with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele expoziției nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate required fields
            Map<String, String> validationErrors = new HashMap<>();
            if (newExhibition.getName() == null || newExhibition.getName().trim().isEmpty()) {
                validationErrors.put("name", "Numele expoziției este obligatoriu");
            }
            if (newExhibition.getDescription() == null || newExhibition.getDescription().trim().isEmpty()) {
                validationErrors.put("description", "Descrierea expoziției este obligatorie");
            }
            if (newExhibition.getTip() == null) {
                validationErrors.put("tip", "Tipul expoziției este obligatoriu");
            }
            
            if (!validationErrors.isEmpty()) {
                logger.warn("Validation failed for exhibition creation: {}", validationErrors);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele expoziției nu sunt complete");
                errorResponse.put("validationErrors", validationErrors);
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("Creating new exhibition: {}", newExhibition.getName());
            
            expozitieService.createExhibition(newExhibition);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Expoziția a fost creată cu succes");
            response.put("status", "success");
            response.put("exhibitionName", newExhibition.getName());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while creating exhibition", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Există deja o expoziție cu aceste date sau datele nu respectă restricțiile");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while creating exhibition", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la crearea expoziției. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> updateExhibition(@RequestBody Expozitie updatedExhibition){
        try {
            // Validate input
            if (updatedExhibition == null) {
                logger.warn("Attempt to update exhibition with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele expoziției nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (updatedExhibition.getId() == null || updatedExhibition.getId() <= 0) {
                logger.warn("Invalid exhibition ID for update: {}", updatedExhibition.getId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul expoziției trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if exhibition exists
            Expozitie existingExhibition = expozitieService.findExhibitionById(updatedExhibition.getId());
            if (existingExhibition == null) {
                logger.warn("Attempted to update non-existent exhibition with ID: {}", updatedExhibition.getId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Expoziția cu ID-ul " + updatedExhibition.getId() + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Updating exhibition with ID: {} - {}", updatedExhibition.getId(), updatedExhibition.getName());
            
            expozitieService.updateExhibition(updatedExhibition);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Expoziția a fost actualizată cu succes");
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while updating exhibition: " + updatedExhibition.getId(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Datele nu respectă restricțiile de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while updating exhibition: " + updatedExhibition.getId(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la actualizarea expoziției. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteExhibition(@PathVariable Integer id){
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid exhibition ID for deletion: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul expoziției trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if exhibition exists before trying to delete
            Expozitie existingExhibition = expozitieService.findExhibitionById(id);
            if (existingExhibition == null) {
                logger.warn("Attempted to delete non-existent exhibition with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Expoziția cu ID-ul " + id + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Deleting exhibition with ID: {} - {}", id, existingExhibition.getName());
            
            expozitieService.deleteExhibition(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Expoziția a fost ștearsă cu succes");
            response.put("status", "success");
            return ResponseEntity.ok(response);
            
        } catch (EmptyResultDataAccessException e) {
            logger.error("Exhibition not found for deletion: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Expoziția nu a fost găsită");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while deleting exhibition: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu se poate șterge expoziția din cauza restricțiilor de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while deleting exhibition: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la ștergerea expoziției. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}