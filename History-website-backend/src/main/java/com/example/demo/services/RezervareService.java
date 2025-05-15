package com.example.demo.services;

import com.example.demo.models.Rezervare;
import com.example.demo.models.Rezervare.ReservationStatus;
import com.example.demo.repos.RezervareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class RezervareService {
    @Autowired
    RezervareRepository rezervareRepository;

    public List<Rezervare> getAllBookings(){
        return rezervareRepository.findAll();
    }

    public void createBooking(Rezervare newBooking){
        // Asigurăm că orice rezervare nouă are status IN_ASTEPTARE
        newBooking.setStatus(ReservationStatus.IN_ASTEPTARE);
        rezervareRepository.save(newBooking);
    }

    public void updateBooking(Rezervare updatedBooking){
        rezervareRepository.save(updatedBooking);
    }

    public void deleteBooking(Integer bookingId){
        rezervareRepository.deleteById(bookingId);
    }

    public Rezervare findBookingById(Integer bookingId){
        return rezervareRepository.findById(bookingId)
                .orElseThrow(()
                -> new RuntimeException("Nu s-a gasit rezervare cu ID-ul" + bookingId));
    }
    
    public void approveBooking(Integer bookingId) {
        Rezervare booking = findBookingById(bookingId);
        booking.setStatus(ReservationStatus.APROBATA);
        rezervareRepository.save(booking);
    }
    
    public int getPendingBookingsCount() {
        return rezervareRepository.countByStatus(ReservationStatus.IN_ASTEPTARE);
    }
    
    /**
     * Obține numărul de rezervări aprobate pentru o anumită dată și interval orar
     * @param date Data pentru care se verifică rezervările
     * @param startHour Ora de început a intervalului (inclusiv)
     * @param endHour Ora de sfârșit a intervalului (inclusiv)
     * @return Numărul de rezervări aprobate
     */
    public int getApprovedBookingsCountForTimeInterval(LocalDate date, int startHour, int endHour) {
        return rezervareRepository.countApprovedBookingsByDateAndTimeInterval(date, startHour, endHour);
    }
    
    /**
     * Obține contoarele pentru toate intervalele de 2 ore disponibile într-o zi
     * @param date Data pentru care se calculează contoarele
     * @return Un map cu intervalele orare ca cheie și numărul de rezervări aprobate ca valoare
     */
    public Map<String, Integer> getApprovedBookingsCountByTimeSlots(LocalDate date) {
        Map<String, Integer> counters = new HashMap<>();
        
        // Generează intervale de câte 2 ore (8-10, 10-12, 12-14, etc)
        for (int hour = 8; hour < 18; hour += 2) {
            int count = rezervareRepository.countApprovedBookingsByDateAndTimeInterval(date, hour, hour + 1);
            String timeSlot = String.format("%02d:00-%02d:00", hour, hour + 2);
            counters.put(timeSlot, count);
        }
        
        return counters;
    }
}

