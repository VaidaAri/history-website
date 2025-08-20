package com.museumhistory.controller;

import com.museumhistory.model.MuseumSchedule;
import com.museumhistory.service.MuseumScheduleService;
import com.museumhistory.repository.MuseumScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/museum-schedule")
public class MuseumScheduleController {

    private static final Logger logger = LoggerFactory.getLogger(MuseumScheduleController.class);

    @Autowired
    private MuseumScheduleService scheduleService;
    
    @Autowired
    private MuseumScheduleRepository scheduleRepository;
    
    @GetMapping("/current")
    public ResponseEntity<Object> getCurrentSchedule() {
        try {
            logger.debug("Fetching current museum schedule");
            MuseumSchedule currentSchedule = scheduleService.getCurrentSchedule();
            
            if (currentSchedule == null) {
                logger.warn("No current schedule found");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Nu s-a găsit programul curent al muzeului");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            return ResponseEntity.ok(currentSchedule);
        } catch (Exception e) {
            logger.error("Error fetching current museum schedule", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-a putut încărca programul curent al muzeului");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping
    public ResponseEntity<Object> getAllSchedules() {
        try {
            logger.debug("Fetching all museum schedules");
            List<MuseumSchedule> schedules = scheduleService.getAllSchedules();
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            logger.error("Error fetching all museum schedules", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-au putut încărca programele muzeului");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateSchedule(@PathVariable Integer id, @RequestBody MuseumSchedule updatedSchedule) {
        try {
            // Validate ID
            if (id == null || id <= 0) {
                logger.warn("Invalid schedule ID for update: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul programului trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate input
            if (updatedSchedule == null) {
                logger.warn("Attempt to update schedule with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele programului nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate ID consistency
            if (!id.equals(updatedSchedule.getId())) {
                logger.warn("Path ID {} does not match body ID {}", id, updatedSchedule.getId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul din path nu corespunde cu ID-ul din body");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if schedule exists
            List<MuseumSchedule> allSchedules = scheduleService.getAllSchedules();
            boolean scheduleExists = allSchedules.stream()
                    .anyMatch(schedule -> schedule.getId().equals(id));
            
            if (!scheduleExists) {
                logger.warn("Attempted to update non-existent schedule with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Programul cu ID-ul " + id + " nu a fost găsit");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Updating museum schedule with ID: {}", id);
            
            MuseumSchedule updatedResult = scheduleService.updateSchedule(updatedSchedule);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Programul a fost actualizat cu succes");
            response.put("status", "success");
            response.put("schedule", updatedResult);
            
            return ResponseEntity.ok(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while updating schedule: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Datele nu respectă restricțiile de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while updating schedule: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la actualizarea programului. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/update-summer-text")
    public ResponseEntity<Object> updateSummerText() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            logger.debug("Updating summer schedule text");
            List<MuseumSchedule> allSchedules = scheduleRepository.findAll();
            
            if (allSchedules.isEmpty()) {
                logger.warn("No schedules found in database");
                response.put("status", "error");
                response.put("message", "Nu s-au găsit programe în baza de date");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            for (MuseumSchedule schedule : allSchedules) {
                if ("Vară".equals(schedule.getSeasonName())) {
                    String oldText = schedule.getSpecialNotes();
                    schedule.setSpecialNotes("Muzeul este ÎNCHIS LUNEA pentru activități administrative.");
                    scheduleRepository.save(schedule);
                    
                    logger.info("Updated summer schedule text successfully");
                    
                    response.put("status", "success");
                    response.put("message", "Textul pentru programul de vară a fost actualizat cu succes!");
                    response.put("oldText", oldText != null ? oldText : "N/A");
                    response.put("newText", schedule.getSpecialNotes());
                    return ResponseEntity.ok(response);
                }
            }
            
            logger.warn("Summer schedule not found in database");
            response.put("status", "error");
            response.put("message", "Nu s-a găsit programul de vară în baza de date.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while updating summer text", e);
            response.put("status", "error");
            response.put("message", "Eroare de integritate la actualizarea textului");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (Exception e) {
            logger.error("Unexpected error while updating summer text", e);
            response.put("status", "error");
            response.put("message", "Eroare la actualizarea textului: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}