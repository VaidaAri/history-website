package com.example.demo.services;

import com.example.demo.models.Rezervare;
import com.example.demo.repos.RezervareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RezervareService {
    @Autowired
    RezervareRepository rezervareRepository;

    public RezervareRepository getAllBookings(){
        return rezervareRepository;
    }

    public void createBooking(Rezervare newBooking){
        rezervareRepository.save(newBooking);
    }

    public void updateBooking(Rezervare newBooking){
        rezervareRepository.save(newBooking);
    }

    public void deleteBooking(Integer bookingId){
        rezervareRepository.deleteById(bookingId);
    }

    public Rezervare findBookingById(Integer bookingId){
        return rezervareRepository.findById(bookingId)
                .orElseThrow(()
                -> new RuntimeException("Nu s-a gasit rezervare cu ID-ul" + bookingId));
    }
}

