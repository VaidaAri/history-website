package com.museumhistory.service;

import com.museumhistory.model.Rezervare;
import com.museumhistory.repository.RezervareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class RezervareService {
    
    @Autowired
    RezervareRepository rezervareRepository;
    
    @Autowired
    EmailService emailService;

    public List<Rezervare> getAllBookings(){
        return rezervareRepository.findAll();
    }

    public void createBooking(Rezervare newBooking){
        Rezervare savedReservation = rezervareRepository.save(newBooking);
        
        try {
            emailService.sendApprovalEmail(savedReservation);
        } catch (Exception e) {
            System.err.println("Eroare la trimiterea email-ului de confirmare: " + e.getMessage());
        }
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
    
    
    
    public int getBookingsCountForTimeInterval(LocalDate date, int startHour, int endHour) {
        return rezervareRepository.countBookingsByDateAndTimeInterval(date, startHour, endHour);
    }
    
    public Map<String, Integer> getBookingsCountByTimeSlots(LocalDate date) {
        Map<String, Integer> counters = new HashMap<>();
        for (int hour = 8; hour < 18; hour += 2) {
            // Pentru un slot de 2 ore (ex: 08:00-10:00), verificăm orele 8 și 9
            int count = rezervareRepository.countBookingsByDateAndTimeInterval(date, hour, hour + 1);
            String timeSlot = String.format("%02d:00-%02d:00", hour, hour + 2);
            counters.put(timeSlot, count);
        }
        
        return counters;
    }
    
    public List<Rezervare> getAllBookings() {
        return rezervareRepository.findAll();
    }
    
    
    public Map<String, Map<String, Object>> getCalendarDensityForMonth(int year, int month) {
        Map<String, Map<String, Object>> calendarData = new HashMap<>();
        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.withDayOfMonth(firstDay.lengthOfMonth());
        
        for (LocalDate date = firstDay; !date.isAfter(lastDay); date = date.plusDays(1)) {
            Map<String, Integer> timeSlots = getBookingsCountByTimeSlots(date);
            
            int totalSlots = timeSlots.size();
            int fullSlots = 0;
            int partialSlots = 0;
            int emptySlots = 0;
            
            for (Integer count : timeSlots.values()) {
                if (count >= 2) {
                    fullSlots++;
                } else if (count == 1) {
                    partialSlots++;
                } else {
                    emptySlots++;
                }
            }
            
            String dayStatus;
            if (fullSlots == totalSlots) {
                dayStatus = "full";
            } else if (partialSlots > 0 || fullSlots > 0) {
                dayStatus = "partial";
            } else {
                dayStatus = "available";
            }
            
            int availableSlots = (emptySlots * 2) + partialSlots;
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("status", dayStatus);
            dayData.put("availableSlots", availableSlots);
            dayData.put("totalSlots", totalSlots * 2);
            dayData.put("timeSlots", timeSlots);
            dayData.put("fullSlots", fullSlots);
            dayData.put("partialSlots", partialSlots);
            dayData.put("emptySlots", emptySlots);
            
            calendarData.put(date.toString(), dayData);
        }
        
        return calendarData;
    }
    
    /**
     * Get expired reservations (visit datetime + 3 days is in the past)
     */
    public List<Rezervare> getExpiredReservations() {
        LocalDateTime cutoffDateTime = LocalDateTime.now().minusDays(3);
        return rezervareRepository.findExpiredReservations(cutoffDateTime);
    }
    
    /**
     * Delete expired reservations (visit datetime + 3 days is in the past)
     * @return number of reservations deleted
     */
    public int deleteExpiredReservations() {
        LocalDateTime cutoffDateTime = LocalDateTime.now().minusDays(3);
        return rezervareRepository.deleteExpiredReservations(cutoffDateTime);
    }
}

