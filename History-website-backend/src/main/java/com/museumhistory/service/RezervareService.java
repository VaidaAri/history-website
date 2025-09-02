package com.museumhistory.service;

import com.museumhistory.model.Rezervare;
import com.museumhistory.model.Rezervare.ReservationStatus;
import com.museumhistory.repository.RezervareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;

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
        String confirmationToken = emailService.generateConfirmationToken();
        newBooking.setConfirmationToken(confirmationToken);
        newBooking.setTokenExpiry(LocalDateTime.now().plusHours(24));
        newBooking.setStatus(ReservationStatus.NECONFIRMATA);
        
        Rezervare savedReservation = rezervareRepository.save(newBooking);
        
        try {
            emailService.sendConfirmationEmail(savedReservation);
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
    
    public void approveBooking(Integer bookingId) {
        Rezervare booking = findBookingById(bookingId);
        booking.setStatus(ReservationStatus.CONFIRMATA);
        rezervareRepository.save(booking);
        try {
            emailService.sendApprovalEmail(booking);
        } catch (Exception e) {
            System.err.println("Eroare la trimiterea email-ului de aprobare: " + e.getMessage());
        }
    }
    
    public int getPendingBookingsCount() {
        return rezervareRepository.countByStatus(ReservationStatus.NECONFIRMATA);
    }
    
    public int getConfirmedBookingsCountForTimeInterval(LocalDate date, int startHour, int endHour) {
        return rezervareRepository.countConfirmedBookingsByDateAndTimeInterval(date, startHour, endHour);
    }
    
    public Map<String, Integer> getConfirmedBookingsCountByTimeSlots(LocalDate date) {
        Map<String, Integer> counters = new HashMap<>();
        for (int hour = 8; hour < 18; hour += 2) {
            int count = rezervareRepository.countConfirmedBookingsByDateAndTimeInterval(date, hour, hour + 1);
            String timeSlot = String.format("%02d:00-%02d:00", hour, hour + 2);
            counters.put(timeSlot, count);
        }
        
        return counters;
    }
    
    public Optional<Rezervare> findByConfirmationToken(String token) {
        return rezervareRepository.findByConfirmationToken(token);
    }
    
    public boolean confirmReservation(String token) {
        Optional<Rezervare> optionalReservation = findByConfirmationToken(token);
        
        if (optionalReservation.isEmpty()) {
            return false;
        }
        
        Rezervare reservation = optionalReservation.get();
        
        if (reservation.getTokenExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }
        
        if (reservation.getStatus() != ReservationStatus.NECONFIRMATA) {
            return false;
        }
        reservation.setStatus(ReservationStatus.CONFIRMATA);
        reservation.setConfirmedAt(LocalDateTime.now());
        rezervareRepository.save(reservation);
        try {
            emailService.sendApprovalEmail(reservation);
        } catch (Exception e) {
            System.err.println("Eroare la trimiterea email-ului de confirmare: " + e.getMessage());
        }
        
        return true;
    }
    
    public List<Rezervare> getConfirmedBookings() {
        return rezervareRepository.findByStatusIn(List.of(
            ReservationStatus.CONFIRMATA
        ));
    }
    
    
    public Map<String, Map<String, Object>> getCalendarDensityForMonth(int year, int month) {
        Map<String, Map<String, Object>> calendarData = new HashMap<>();
        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.withDayOfMonth(firstDay.lengthOfMonth());
        
        for (LocalDate date = firstDay; !date.isAfter(lastDay); date = date.plusDays(1)) {
            Map<String, Integer> timeSlots = getConfirmedBookingsCountByTimeSlots(date);
            
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

