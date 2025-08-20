package com.museumhistory.controller;

import com.museumhistory.model.Eveniment;
import com.museumhistory.service.EvenimentService;
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
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:4200")
public class EvenimentController {

    private static final Logger logger = LoggerFactory.getLogger(EvenimentController.class);

    @Autowired
    private EvenimentService evenimentService;

    @GetMapping
    public ResponseEntity<Object> getAllEvents(){
        try {
            logger.debug("Fetching all events");
            List<Eveniment> events = evenimentService.getAllEvents();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            logger.error("Error fetching all events", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-au putut încărca evenimentele");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getEventById(@PathVariable Integer id){
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid event ID provided: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul evenimentului trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching event with ID: {}", id);
            Eveniment event = evenimentService.findEventById(id);
            
            if (event == null) {
                logger.warn("Event not found with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Evenimentul cu ID-ul " + id + " nu a fost găsit");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            logger.error("Error fetching event with ID: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la căutarea evenimentului");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createEvent(@RequestBody Eveniment newEvent){
        try {
            // Validate input
            if (newEvent == null) {
                logger.warn("Attempt to create event with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele evenimentului nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate required fields
            Map<String, String> validationErrors = new HashMap<>();
            if (newEvent.getName() == null || newEvent.getName().trim().isEmpty()) {
                validationErrors.put("name", "Numele evenimentului este obligatoriu");
            }
            if (newEvent.getDescription() == null || newEvent.getDescription().trim().isEmpty()) {
                validationErrors.put("description", "Descrierea evenimentului este obligatorie");
            }
            if (newEvent.getStartDate() == null) {
                validationErrors.put("startDate", "Data de început este obligatorie");
            }
            
            if (!validationErrors.isEmpty()) {
                logger.warn("Validation failed for event creation: {}", validationErrors);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele evenimentului nu sunt complete");
                errorResponse.put("validationErrors", validationErrors);
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("Creating new event: {}", newEvent.getName());
            
            evenimentService.createEvent(newEvent);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Evenimentul a fost creat cu succes");
            response.put("status", "success");
            response.put("eventName", newEvent.getName());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while creating event", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Există deja un eveniment cu aceste date sau datele nu respectă restricțiile");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while creating event", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la crearea evenimentului. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateEvent(@PathVariable Integer id, @RequestBody Eveniment updatedEvent){
        try {
            // Validate ID
            if (id == null || id <= 0) {
                logger.warn("Invalid event ID for update: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul evenimentului trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate input
            if (updatedEvent == null) {
                logger.warn("Attempt to update event with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele evenimentului nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if event exists
            Eveniment existingEvent = evenimentService.findEventById(id);
            if (existingEvent == null) {
                logger.warn("Attempted to update non-existent event with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Evenimentul cu ID-ul " + id + " nu a fost găsit");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Updating event with ID: {} - {}", id, updatedEvent.getName());
            
            updatedEvent.setId(id);
            evenimentService.updateEvent(updatedEvent);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Evenimentul a fost actualizat cu succes");
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while updating event: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Datele nu respectă restricțiile de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while updating event: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la actualizarea evenimentului. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEvent(@PathVariable Integer id){
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid event ID for deletion: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul evenimentului trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if event exists before trying to delete
            Eveniment existingEvent = evenimentService.findEventById(id);
            if (existingEvent == null) {
                logger.warn("Attempted to delete non-existent event with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Evenimentul cu ID-ul " + id + " nu a fost găsit");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Deleting event with ID: {} - {}", id, existingEvent.getName());
            
            evenimentService.deleteEvent(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Evenimentul a fost șters cu succes");
            response.put("status", "success");
            return ResponseEntity.ok(response);
            
        } catch (EmptyResultDataAccessException e) {
            logger.error("Event not found for deletion: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Evenimentul nu a fost găsit");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while deleting event: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu se poate șterge evenimentul din cauza restricțiilor de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while deleting event: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la ștergerea evenimentului. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/calendar-density/{year}/{month}")
    public ResponseEntity<Object> getEventDensity(@PathVariable int year, @PathVariable int month) {
        try {
            // Validate year
            if (year < 2020 || year > 2030) {
                logger.warn("Invalid year for event density: {}", year);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Anul trebuie să fie între 2020 și 2030");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate month
            if (month < 1 || month > 12) {
                logger.warn("Invalid month for event density: {}", month);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Luna trebuie să fie între 1 și 12");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching event density for year: {}, month: {}", year, month);
            
            Map<String, Map<String, Object>> densityData = evenimentService.getEventDensityForMonth(year, month);
            
            // Wrap response with success status
            Map<String, Object> response = new HashMap<>();
            response.put("year", year);
            response.put("month", month);
            response.put("densityData", densityData);
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching event density for year: " + year + ", month: " + month, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-a putut încărca densitatea evenimentelor pentru luna specificată");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
