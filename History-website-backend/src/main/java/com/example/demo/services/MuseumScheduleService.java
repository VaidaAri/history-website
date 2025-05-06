package com.example.demo.services;

import com.example.demo.models.MuseumSchedule;
import com.example.demo.repos.MuseumScheduleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

@Service
public class MuseumScheduleService {
    @Autowired
    private MuseumScheduleRepository scheduleRepository;
    
    // Inițializarea programelor implicite dacă nu există
    @PostConstruct
    public void initDefaultSchedules() {
        if (scheduleRepository.count() == 0) {
            // Program de vară (aprilie-octombrie)
            MuseumSchedule summerSchedule = new MuseumSchedule();
            summerSchedule.setSeasonName("Vară");
            summerSchedule.setWeekdaysOpen("09:00");
            summerSchedule.setWeekdaysClose("18:00");
            summerSchedule.setWeekendOpen("10:00");
            summerSchedule.setWeekendClose("16:00");
            summerSchedule.setSpecialNotes("Muzeul este ÎNCHIS LUNEA pentru activități administrative. Ultima intrare cu 30 de minute înainte de închidere.");
            summerSchedule.setActive(true);
            summerSchedule.setValidMonths(Arrays.asList(3, 4, 5, 6, 7, 8, 9)); // Apr-Oct
            
            // Program de iarnă (noiembrie-martie)
            MuseumSchedule winterSchedule = new MuseumSchedule();
            winterSchedule.setSeasonName("Iarnă");
            winterSchedule.setWeekdaysOpen("10:00");
            winterSchedule.setWeekdaysClose("17:00");
            winterSchedule.setWeekendOpen("10:00");
            winterSchedule.setWeekendClose("15:00");
            winterSchedule.setSpecialNotes("Muzeul este ÎNCHIS LUNEA pentru activități administrative. Închis în zilele de 25, 26 decembrie și 1, 2 ianuarie.");
            winterSchedule.setActive(true);
            winterSchedule.setValidMonths(Arrays.asList(0, 1, 2, 10, 11)); // Nov-Mar
            
            scheduleRepository.saveAll(Arrays.asList(summerSchedule, winterSchedule));
        }
    }
    
    // Obține programul pentru luna curentă
    public MuseumSchedule getCurrentSchedule() {
        Calendar cal = Calendar.getInstance();
        int currentMonth = cal.get(Calendar.MONTH);
        
        return scheduleRepository.findByIsActiveTrueAndValidMonthsContains(currentMonth)
            .orElseThrow(() -> new RuntimeException("Nu există program definit pentru luna curentă"));
    }
    
    // Obține toate programele
    public List<MuseumSchedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }
    
    // Actualizează un program
    public MuseumSchedule updateSchedule(MuseumSchedule updatedSchedule) {
        return scheduleRepository.save(updatedSchedule);
    }
}