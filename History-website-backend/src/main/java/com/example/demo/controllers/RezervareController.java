package com.example.demo.controllers;

import com.example.demo.models.Rezervare;
import com.example.demo.services.RezervareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/bookings")
public class RezervareController {

    @Autowired
    private RezervareService rezervareService;
    
    @GetMapping("/pending-count")
    public Map<String, Integer> getPendingBookingsCount() {
        int count = rezervareService.getPendingBookingsCount();
        Map<String, Integer> response = new HashMap<>();
        response.put("count", count);
        return response;
    }

    @GetMapping
    public List<Rezervare> getAllBookings(){
        return rezervareService.getConfirmedBookings(); // Doar rezervările confirmate pentru admin
    }

    @GetMapping("/{id}")
    public Rezervare getBookingById(@PathVariable Integer id){
        return rezervareService.findBookingById(id);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createBooking(@RequestBody Rezervare newBooking){
        rezervareService.createBooking(newBooking);
        return ResponseEntity.ok(Map.of(
            "message", "Rezervare creată cu succes. Verificați email-ul pentru confirmare.",
            "status", newBooking.getStatus().getDisplayName()
        ));
    }

    @PutMapping
    public void updateBooking(@RequestBody Rezervare updatedBooking){
        rezervareService.updateBooking(updatedBooking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Integer id){
        rezervareService.deleteBooking(id);
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<Map<String, String>> approveBooking(@PathVariable Integer id) {
        rezervareService.approveBooking(id);
        return ResponseEntity.ok(Map.of(
            "message", "Rezervare aprobată cu succes.",
            "status", "Aprobată"
        ));
    }
    
    /**
     * Endpoint pentru obținerea numărului de rezervări aprobate pentru o anumită dată și interval orar
     */
    @GetMapping("/approved-count")
    public Map<String, Object> getApprovedBookingsCount(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer startHour,
            @RequestParam(required = false) Integer endHour) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("date", date.toString());
        
        // Dacă sunt specificate startHour și endHour, returnăm contorul pentru intervalul specificat
        if (startHour != null && endHour != null) {
            int count = rezervareService.getApprovedBookingsCountForTimeInterval(date, startHour, endHour);
            response.put("startHour", startHour);
            response.put("endHour", endHour);
            response.put("count", count);
        } 
        // Altfel, returnăm contoarele pentru toate intervalele de 2 ore din ziua respectivă
        else {
            Map<String, Integer> timeSlotCounts = rezervareService.getApprovedBookingsCountByTimeSlots(date);
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
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<Map<String, String>> rejectBooking(
            @PathVariable Integer id, 
            @RequestBody(required = false) Map<String, String> requestBody) {
        
        String reason = requestBody != null ? requestBody.get("reason") : null;
        rezervareService.rejectBooking(id, reason);
        
        return ResponseEntity.ok(Map.of(
            "message", "Rezervare respinsă cu succes.",
            "status", "Respinsă"
        ));
    }
}
