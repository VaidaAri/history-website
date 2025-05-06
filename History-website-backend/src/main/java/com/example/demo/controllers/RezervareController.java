package com.example.demo.controllers;

import com.example.demo.models.Rezervare;
import com.example.demo.services.RezervareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            "message", "Rezervare creată cu succes. Statusul este 'În așteptare'.",
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
}
