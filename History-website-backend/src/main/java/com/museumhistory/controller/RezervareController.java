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
    public ResponseEntity<Object> getAllBookingsForStatistics(){
        try {
            logger.debug("Fetching all bookings for statistics");
            List<Rezervare> bookings = rezervareService.getAllBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            logger.error("Error fetching all bookings for statistics", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-au putut încărca statisticile rezervărilor");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
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
    public ResponseEntity<Map<String, Object>> updateBooking(@RequestBody Rezervare updatedBooking){
        try {
            // Validate input
            if (updatedBooking == null) {
                logger.warn("Attempt to update booking with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele rezervării nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (updatedBooking.getId() == null || updatedBooking.getId() <= 0) {
                logger.warn("Invalid booking ID for update: {}", updatedBooking.getId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul rezervării trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate required fields
            Map<String, String> validationErrors = new HashMap<>();
            if (updatedBooking.getNume() == null || updatedBooking.getNume().trim().isEmpty()) {
                validationErrors.put("nume", "Numele este obligatoriu");
            }
            if (updatedBooking.getPrenume() == null || updatedBooking.getPrenume().trim().isEmpty()) {
                validationErrors.put("prenume", "Prenumele este obligatoriu");
            }
            if (updatedBooking.getEmail() == null || updatedBooking.getEmail().trim().isEmpty()) {
                validationErrors.put("email", "Email-ul este obligatoriu");
            }
            if (updatedBooking.getDatetime() == null) {
                validationErrors.put("datetime", "Data și ora sunt obligatorii");
            }
            
            if (!validationErrors.isEmpty()) {
                logger.warn("Validation failed for booking update: {}", validationErrors);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele rezervării nu sunt complete");
                errorResponse.put("validationErrors", validationErrors);
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if booking exists before trying to update
            Rezervare existingBooking = rezervareService.findBookingById(updatedBooking.getId());
            if (existingBooking == null) {
                logger.warn("Attempted to update non-existent booking with ID: {}", updatedBooking.getId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Rezervarea cu ID-ul " + updatedBooking.getId() + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Updating booking with ID: {} for user: {} {}", 
                updatedBooking.getId(), updatedBooking.getNume(), updatedBooking.getPrenume());
            
            rezervareService.updateBooking(updatedBooking);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Rezervarea a fost actualizată cu succes");
            response.put("status", "success");
            return ResponseEntity.ok(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while updating booking: " + updatedBooking.getId(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Există deja o rezervare cu aceste date sau datele nu respectă restricțiile");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument while updating booking: " + updatedBooking.getId(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("status", "error");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while updating booking: " + updatedBooking.getId(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la actualizarea rezervării. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
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
    public ResponseEntity<Map<String, Object>> getConfirmedBookingsCount(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer startHour,
            @RequestParam(required = false) Integer endHour) {
        try {
            // Validate input date
            if (date == null) {
                logger.warn("Confirmed bookings count requested with null date");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Data este obligatorie");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate time interval if provided
            if ((startHour != null && endHour == null) || (startHour == null && endHour != null)) {
                logger.warn("Invalid time interval: startHour={}, endHour={}", startHour, endHour);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Dacă specificați un interval orar, ambele valori (ora început și ora sfârșit) sunt obligatorii");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (startHour != null && endHour != null) {
                if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
                    logger.warn("Invalid hour values: startHour={}, endHour={}", startHour, endHour);
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Orele trebuie să fie între 0 și 23");
                    errorResponse.put("status", "error");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
                if (startHour >= endHour) {
                    logger.warn("Invalid time interval: startHour={} >= endHour={}", startHour, endHour);
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Ora de început trebuie să fie mai mică decât ora de sfârșit");
                    errorResponse.put("status", "error");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }
            
            logger.debug("Fetching confirmed bookings count for date: {}, startHour: {}, endHour: {}", 
                date, startHour, endHour);
            
            Map<String, Object> response = new HashMap<>();
            response.put("date", date.toString());
            response.put("status", "success");
            
            if (startHour != null && endHour != null) {
                int count = rezervareService.getConfirmedBookingsCountForTimeInterval(date, startHour, endHour);
                response.put("startHour", startHour);
                response.put("endHour", endHour);
                response.put("count", count);
            } else {
                Map<String, Integer> timeSlotCounts = rezervareService.getConfirmedBookingsCountByTimeSlots(date);
                response.put("timeSlots", timeSlotCounts);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument while fetching confirmed bookings count", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Date sau interval orar invalid: " + e.getMessage());
            errorResponse.put("status", "error");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            logger.error("Error fetching confirmed bookings count for date: " + date, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-au putut încărca statisticile rezervărilor pentru data specificată");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @PostMapping("/confirm/{token}")
    public ResponseEntity<Map<String, Object>> confirmReservation(@PathVariable String token) {
        try {
            // Validate token
            if (token == null || token.trim().isEmpty()) {
                logger.warn("Reservation confirmation attempted with empty token");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Token-ul de confirmare este obligatoriu");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Sanitize token
            token = token.trim();
            
            if (token.length() < 10) { // Basic validation for token format
                logger.warn("Reservation confirmation attempted with invalid token format: {}", token);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Format invalid pentru token-ul de confirmare");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("Attempting to confirm reservation with token: {}", token.substring(0, 8) + "...");
            
            boolean confirmed = rezervareService.confirmReservation(token);
            
            if (confirmed) {
                logger.info("Reservation confirmed successfully with token: {}", token.substring(0, 8) + "...");
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Rezervarea a fost confirmată cu succes!");
                response.put("status", "success");
                return ResponseEntity.ok(response);
            } else {
                logger.warn("Failed to confirm reservation with token: {}", token.substring(0, 8) + "...");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Token invalid sau expirat. Vă rugăm să verificați email-ul sau să faceți o nouă rezervare.");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument while confirming reservation", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Token invalid: " + e.getMessage());
            errorResponse.put("status", "error");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while confirming reservation with token: " + token, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la confirmarea rezervării. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/calendar-density/{year}/{month}")
    public ResponseEntity<Object> getCalendarDensity(
            @PathVariable int year, 
            @PathVariable int month) {
        try {
            // Validate year
            if (year < 2020 || year > 2030) {
                logger.warn("Invalid year for calendar density: {}", year);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Anul trebuie să fie între 2020 și 2030");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate month
            if (month < 1 || month > 12) {
                logger.warn("Invalid month for calendar density: {}", month);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Luna trebuie să fie între 1 și 12");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching calendar density for year: {}, month: {}", year, month);
            
            Map<String, Map<String, Object>> densityData = rezervareService.getCalendarDensityForMonth(year, month);
            
            // Wrap response with success status
            Map<String, Object> response = new HashMap<>();
            response.put("year", year);
            response.put("month", month);
            response.put("densityData", densityData);
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument while fetching calendar density", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Parametri invalizi pentru densitatea calendarului: " + e.getMessage());
            errorResponse.put("status", "error");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            logger.error("Error fetching calendar density for year: " + year + ", month: " + month, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-a putut încărca densitatea calendarului pentru luna specificată");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
}
