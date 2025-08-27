package com.museumhistory.service;

import com.museumhistory.model.Eveniment;
import com.museumhistory.model.Rezervare;
import com.museumhistory.repository.EvenimentRepository;
import com.museumhistory.repository.ParticipantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(EventCleanupService.class);
    
    // Events older than this number of months will be deleted
    private static final int RETENTION_MONTHS = 1;

    @Autowired
    private EvenimentRepository evenimentRepository;
    
    @Autowired
    private ParticipantRepository participantRepository;
    
    @Autowired
    private RezervareService rezervareService;

    /**
     * Scheduled job that runs daily at 2:00 AM to clean up old events and expired reservations
     * Cron format: second, minute, hour, day, month, weekday
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanupOldEvents() {
        logger.info("Starting scheduled cleanup of old events and expired reservations");
        
        try {
            // First cleanup expired reservations (visit datetime + 24h past)
            cleanupExpiredReservations();
            
            // Then cleanup old events (existing logic)
            LocalDate cutoffDate = LocalDate.now().minusMonths(RETENTION_MONTHS);
            logger.info("Cleaning up events older than: {}", cutoffDate);
            
            // First, find events that will be deleted for logging
            List<Eveniment> oldEvents = evenimentRepository.findEventsOlderThan(cutoffDate);
            
            if (oldEvents.isEmpty()) {
                logger.info("No old events found for cleanup");
                return;
            }
            
            logger.info("Found {} events to delete", oldEvents.size());
            
            // Delete associated participants first (to avoid foreign key issues)
            int participantsDeleted = 0;
            for (Eveniment event : oldEvents) {
                long participantCount = participantRepository.countByEvenimentId(event.getId());
                if (participantCount > 0) {
                    participantRepository.deleteByEvenimentId(event.getId());
                    participantsDeleted += participantCount;
                }
            }
            
            if (participantsDeleted > 0) {
                logger.info("Deleted {} participants from old events", participantsDeleted);
            }
            
            // Now delete the events
            int deletedCount = evenimentRepository.deleteEventsOlderThan(cutoffDate);
            
            logger.info("Successfully cleaned up {} old events and {} associated participants", 
                       deletedCount, participantsDeleted);
            
        } catch (Exception e) {
            logger.error("Error during scheduled cleanup", e);
        }
    }
    
    /**
     * Clean up expired reservations (visit datetime + 3 days is in the past)
     */
    @Transactional
    public void cleanupExpiredReservations() {
        try {
            logger.info("Starting cleanup of expired reservations (3 days after visit time)");
            
            // Get reservations that will be deleted for logging
            List<Rezervare> expiredReservations = rezervareService.getExpiredReservations();
            
            if (expiredReservations.isEmpty()) {
                logger.info("No expired reservations found for cleanup");
                return;
            }
            
            logger.info("Found {} expired reservations to delete", expiredReservations.size());
            
            // Log details for audit purposes
            for (Rezervare reservation : expiredReservations) {
                logger.debug("Deleting expired reservation: ID={}, Email={}, VisitDateTime={}, Status={}", 
                    reservation.getId(), 
                    reservation.getEmail(), 
                    reservation.getDatetime(),
                    reservation.getStatus().getDisplayName());
            }
            
            // Delete expired reservations
            int deletedCount = rezervareService.deleteExpiredReservations();
            
            logger.info("Successfully cleaned up {} expired reservations (3 days after visit time)", deletedCount);
            
        } catch (Exception e) {
            logger.error("Error during expired reservations cleanup", e);
        }
    }

    /**
     * Manual cleanup method that can be called programmatically
     * @return number of events deleted
     */
    @Transactional
    public int manualCleanupOldEvents() {
        logger.info("Manual cleanup of old events requested");
        
        LocalDate cutoffDate = LocalDate.now().minusMonths(RETENTION_MONTHS);
        List<Eveniment> oldEvents = evenimentRepository.findEventsOlderThan(cutoffDate);
        
        if (oldEvents.isEmpty()) {
            logger.info("No old events found for manual cleanup");
            return 0;
        }
        
        // Delete associated participants first
        for (Eveniment event : oldEvents) {
            long participantCount = participantRepository.countByEvenimentId(event.getId());
            if (participantCount > 0) {
                participantRepository.deleteByEvenimentId(event.getId());
            }
        }
        
        int deletedCount = evenimentRepository.deleteEventsOlderThan(cutoffDate);
        logger.info("Manual cleanup completed: {} events deleted", deletedCount);
        
        return deletedCount;
    }
    
    /**
     * Get information about events that would be deleted in the next cleanup
     * @return list of events that are candidates for deletion
     */
    public List<Eveniment> getEventsToBeDeleted() {
        LocalDate cutoffDate = LocalDate.now().minusMonths(RETENTION_MONTHS);
        return evenimentRepository.findEventsOlderThan(cutoffDate);
    }
    
    /**
     * Get the current retention period in months
     * @return retention period in months
     */
    public int getRetentionMonths() {
        return RETENTION_MONTHS;
    }
    
    /**
     * Manual cleanup method for expired reservations
     * @return number of reservations deleted
     */
    @Transactional
    public int manualCleanupExpiredReservations() {
        logger.info("Manual cleanup of expired reservations requested");
        
        List<Rezervare> expiredReservations = rezervareService.getExpiredReservations();
        
        if (expiredReservations.isEmpty()) {
            logger.info("No expired reservations found for manual cleanup");
            return 0;
        }
        
        int deletedCount = rezervareService.deleteExpiredReservations();
        logger.info("Manual cleanup completed: {} expired reservations deleted", deletedCount);
        
        return deletedCount;
    }
    
    /**
     * Get information about reservations that would be deleted in the next cleanup
     * @return list of expired reservations that are candidates for deletion
     */
    public List<Rezervare> getExpiredReservationsToBeDeleted() {
        return rezervareService.getExpiredReservations();
    }
}