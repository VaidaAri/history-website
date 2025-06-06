package com.example.demo.services;

import com.example.demo.models.Rezervare;
import com.example.demo.models.Rezervare.ReservationStatus;
import com.example.demo.repos.RezervareRepository;
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
        // Fluxul nou: creăm rezervarea cu status NECONFIRMATA și trimitem email de confirmare
        String confirmationToken = emailService.generateConfirmationToken();
        newBooking.setConfirmationToken(confirmationToken);
        newBooking.setTokenExpiry(LocalDateTime.now().plusHours(24));
        newBooking.setStatus(ReservationStatus.NECONFIRMATA); // Status inițial neconfirmat
        // Nu setăm confirmedAt încă
        
        // Salvăm rezervarea
        Rezervare savedReservation = rezervareRepository.save(newBooking);
        
        // Trimitem email de confirmare cu link-ul
        try {
            emailService.sendConfirmationEmail(savedReservation);
        } catch (Exception e) {
            System.err.println("Eroare la trimiterea email-ului de confirmare: " + e.getMessage());
            // În caz de eroare la email, păstrăm rezervarea pentru retrimitere
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
        booking.setStatus(ReservationStatus.APROBATA);
        rezervareRepository.save(booking);
        
        // Trimitem email de aprobare
        try {
            emailService.sendApprovalEmail(booking);
        } catch (Exception e) {
            System.err.println("Eroare la trimiterea email-ului de aprobare: " + e.getMessage());
        }
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
    
    public Optional<Rezervare> findByConfirmationToken(String token) {
        return rezervareRepository.findByConfirmationToken(token);
    }
    
    public boolean confirmReservation(String token) {
        Optional<Rezervare> optionalReservation = findByConfirmationToken(token);
        
        if (optionalReservation.isEmpty()) {
            return false; // Token nu există
        }
        
        Rezervare reservation = optionalReservation.get();
        
        // Verificăm dacă token-ul a expirat
        if (reservation.getTokenExpiry().isBefore(LocalDateTime.now())) {
            return false; // Token expirat
        }
        
        // Verificăm dacă rezervarea este în status corect
        if (reservation.getStatus() != ReservationStatus.NECONFIRMATA) {
            return false; // Rezervarea nu este în status NECONFIRMATA
        }
        
        // Confirmăm și aprobăm automat rezervarea
        reservation.setStatus(ReservationStatus.APROBATA);
        reservation.setConfirmedAt(LocalDateTime.now());
        rezervareRepository.save(reservation);
        
        // Trimitem email de confirmare cu detaliile vizitei
        try {
            emailService.sendApprovalEmail(reservation);
        } catch (Exception e) {
            System.err.println("Eroare la trimiterea email-ului de confirmare: " + e.getMessage());
        }
        
        return true;
    }
    
    public List<Rezervare> getConfirmedBookings() {
        return rezervareRepository.findByStatusIn(List.of(
            ReservationStatus.CONFIRMATA,
            ReservationStatus.IN_ASTEPTARE,
            ReservationStatus.APROBATA
        ));
    }
    
    public void rejectBooking(Integer bookingId, String reason) {
        Rezervare booking = findBookingById(bookingId);
        booking.setStatus(ReservationStatus.RESPINSA);
        rezervareRepository.save(booking);
        
        // Trimitem email de respingere
        try {
            emailService.sendRejectionEmail(booking, reason);
        } catch (Exception e) {
            System.err.println("Eroare la trimiterea email-ului de respingere: " + e.getMessage());
        }
    }
    
    /**
     * Calculează densitatea rezervărilor pentru calendar heat-map
     * @param year Anul pentru care se calculează
     * @param month Luna pentru care se calculează (1-12)
     * @return Map cu datele și densitatea pentru fiecare zi
     */
    public Map<String, Map<String, Object>> getCalendarDensityForMonth(int year, int month) {
        Map<String, Map<String, Object>> calendarData = new HashMap<>();
        
        // Calculăm prima și ultima zi a lunii
        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.withDayOfMonth(firstDay.lengthOfMonth());
        
        // Pentru fiecare zi din lună
        for (LocalDate date = firstDay; !date.isAfter(lastDay); date = date.plusDays(1)) {
            // Obținem rezervările pentru fiecare interval de 2 ore
            Map<String, Integer> timeSlots = getApprovedBookingsCountByTimeSlots(date);
            
            // Calculăm densitatea zilei
            int totalSlots = timeSlots.size();
            int fullSlots = 0; // Slot-uri cu 2/2 rezervări
            int partialSlots = 0; // Slot-uri cu 1/2 rezervări
            int emptySlots = 0; // Slot-uri cu 0/2 rezervări
            
            for (Integer count : timeSlots.values()) {
                if (count >= 2) {
                    fullSlots++;
                } else if (count == 1) {
                    partialSlots++;
                } else {
                    emptySlots++;
                }
            }
            
            // Determinăm statusul zilei
            String dayStatus;
            if (fullSlots == totalSlots) {
                dayStatus = "full"; // Toate slot-urile sunt ocupate (roșu)
            } else if (partialSlots > 0 || fullSlots > 0) {
                dayStatus = "partial"; // Unele slot-uri ocupate (galben)
            } else {
                dayStatus = "available"; // Toate slot-urile libere (verde)
            }
            
            // Calculăm slot-urile disponibile
            int availableSlots = (emptySlots * 2) + partialSlots; // Fiecare slot gol = 2 locuri, partial = 1 loc
            
            // Adăugăm în rezultat
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("status", dayStatus);
            dayData.put("availableSlots", availableSlots);
            dayData.put("totalSlots", totalSlots * 2); // Total posibil = slots * 2 rezervări per slot
            dayData.put("timeSlots", timeSlots);
            dayData.put("fullSlots", fullSlots);
            dayData.put("partialSlots", partialSlots);
            dayData.put("emptySlots", emptySlots);
            
            calendarData.put(date.toString(), dayData);
        }
        
        return calendarData;
    }
}

