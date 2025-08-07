package com.museumhistory.controller;

import com.museumhistory.model.Rezervare;
import com.museumhistory.service.RezervareService;
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
        return rezervareService.getConfirmedBookings();
    }

    @GetMapping("/all")
    public List<Rezervare> getAllBookingsForStatistics(){
        return rezervareService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Rezervare getBookingById(@PathVariable Integer id){
        return rezervareService.findBookingById(id);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createBooking(@RequestBody Rezervare newBooking){
        rezervareService.createBooking(newBooking);
        return ResponseEntity.ok(Map.of(
            "message", "Rezervarea a fost înregistrată cu succes! Vă rugăm să verificați email-ul pentru confirmare.",
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
