package com.example.demo.controllers;

import com.example.demo.models.Rezervare;
import com.example.demo.services.RezervareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class RezervareController {

    @Autowired
    private RezervareService rezervareService;

    @GetMapping
    public List<Rezervare> getAllBookings(){
        return rezervareService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Rezervare getBookingById(@PathVariable Integer id){
        return rezervareService.findBookingById(id);
    }

    @PostMapping
    public void createBooking(@RequestBody Rezervare newBooking){
        rezervareService.createBooking(newBooking);
    }

    @PutMapping
    public void updateBooking(@RequestBody Rezervare updatedBooking){
        rezervareService.updateBooking(updatedBooking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Integer id){
        rezervareService.deleteBooking(id);
    }
}
