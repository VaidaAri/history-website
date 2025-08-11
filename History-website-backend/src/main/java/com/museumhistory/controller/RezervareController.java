package com.museumhistory.controller;

import com.museumhistory.model.Rezervare;
import com.museumhistory.service.RezervareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/bookings")
public class RezervareController {

    private static final Logger logger = LoggerFactory.getLogger(RezervareController.class);

    @Autowired
    private RezervareService rezervareService;
    
    @GetMapping("/pending-count")
    public ResponseEntity<Map<String, Object>> getPendingBookingsCount() {
        try {
            logger.debug("Fetching pending bookings count");
            int count = rezervareService.getPendingBookingsCount();
            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching pending bookings count", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-a putut obține numărul de rezervări în așteptare");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<List<Rezervare>> getAllBookings(){
        try {
            logger.debug("Fetching all confirmed bookings");
            List<Rezervare> bookings = rezervareService.getConfirmedBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            logger.error("Error fetching confirmed bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/all")
    public List<Rezervare> getAllBookingsForStatistics(){
        return rezervareService.getAllBookings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getBookingById(@PathVariable Integer id){
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid booking ID provided: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul rezervării trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching booking with ID: {}", id);
            Rezervare booking = rezervareService.findBookingById(id);
            
            if (booking == null) {
                logger.warn("Booking not found with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Rezervarea cu ID-ul " + id + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            logger.error("Error fetching booking with ID: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la căutarea rezervării");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody Rezervare newBooking){
        try {
            // Validate input
            if (newBooking == null) {
                logger.warn("Attempt to create booking with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele rezervării nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate required fields
            Map<String, String> validationErrors = new HashMap<>();
            if (newBooking.getNume() == null || newBooking.getNume().trim().isEmpty()) {
                validationErrors.put("nume", "Numele este obligatoriu");
            }
            if (newBooking.getPrenume() == null || newBooking.getPrenume().trim().isEmpty()) {
                validationErrors.put("prenume", "Prenumele este obligatoriu");
            }
            if (newBooking.getEmail() == null || newBooking.getEmail().trim().isEmpty()) {
                validationErrors.put("email", "Email-ul este obligatoriu");
            }
            if (newBooking.getDatetime() == null) {
                validationErrors.put("datetime", "Data și ora sunt obligatorii");
            }
            
            if (!validationErrors.isEmpty()) {
                logger.warn("Validation failed for booking creation: {}", validationErrors);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele rezervării nu sunt complete");
                errorResponse.put("validationErrors", validationErrors);
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("Creating new booking for: {} {} - {}", 
                newBooking.getNume(), newBooking.getPrenume(), newBooking.getEmail());
            
            rezervareService.createBooking(newBooking);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Rezervarea a fost înregistrată cu succes! Vă rugăm să verificați email-ul pentru confirmare.");
            response.put("status", "success");
            response.put("bookingStatus", newBooking.getStatus().getDisplayName());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while creating booking", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Există deja o rezervare cu aceste date sau datele nu respectă restricțiile");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument while creating booking", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("status", "error");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while creating booking", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la crearea rezervării. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping
    public void updateBooking(@RequestBody Rezervare updatedBooking){
        rezervareService.updateBooking(updatedBooking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteBooking(@PathVariable Integer id){
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid booking ID for deletion: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul rezervării trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if booking exists before trying to delete
            Rezervare existingBooking = rezervareService.findBookingById(id);
            if (existingBooking == null) {
                logger.warn("Attempted to delete non-existent booking with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Rezervarea cu ID-ul " + id + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Deleting booking with ID: {} for user: {} {}", 
                id, existingBooking.getNume(), existingBooking.getPrenume());
            
            rezervareService.deleteBooking(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Rezervarea a fost ștearsă cu succes");
            response.put("status", "success");
            return ResponseEntity.ok(response);
            
        } catch (EmptyResultDataAccessException e) {
            logger.error("Booking not found for deletion: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Rezervarea nu a fost găsită");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while deleting booking: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu se poate șterge rezervarea din cauza restricțiilor de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while deleting booking: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la ștergerea rezervării. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/confirmed-count")
    public Map<String, Object> getConfirmedBookingsCount(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer startHour,
            @RequestParam(required = false) Integer endHour) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("date", date.toString());
        
        if (startHour != null && endHour != null) {
            int count = rezervareService.getConfirmedBookingsCountForTimeInterval(date, startHour, endHour);
            response.put("startHour", startHour);
            response.put("endHour", endHour);
            response.put("count", count);
        } 
        else {
            Map<String, Integer> timeSlotCounts = rezervareService.getConfirmedBookingsCountByTimeSlots(date);
            response.put("timeSlots", timeSlotCounts);
        }
        
        return response;
    }
    
    @PostMapping("/confirm/{token}")
    public ResponseEntity<Map<String, String>> confirmReservation(@PathVariable String token) {
        boolean confirmed = rezervareService.confirmReservation(token);
        
        if (confirmed) {
            return ResponseEntity.ok(Map.of(
                "message", "Rezervarea a fost confirmată cu succes!",
                "status", "success"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Token invalid sau expirat.",
                "status", "error"
            ));
        }
    }
    
    @GetMapping("/calendar-density/{year}/{month}")
    public Map<String, Map<String, Object>> getCalendarDensity(
            @PathVariable int year, 
            @PathVariable int month) {
        
        return rezervareService.getCalendarDensityForMonth(year, month);
    }
    
}
