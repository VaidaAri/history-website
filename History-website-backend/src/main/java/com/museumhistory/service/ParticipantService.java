package com.museumhistory.service;

import com.museumhistory.model.Eveniment;
import com.museumhistory.model.Participant;
import com.museumhistory.repository.EvenimentRepository;
import com.museumhistory.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipantService {
    
    @Autowired
    private ParticipantRepository participantRepository;
    
    @Autowired
    private EvenimentRepository evenimentRepository;
    
    @Autowired
    private EmailService emailService;
    
    public Participant inscriereEveniment(Integer evenimentId, String nume, String prenume, String email) {
        Eveniment eveniment = evenimentRepository.findById(evenimentId)
            .orElseThrow(() -> new RuntimeException("Evenimentul cu ID-ul " + evenimentId + " nu a fost găsit"));
        
        if (participantRepository.existsByEvenimentIdAndEmail(evenimentId, email)) {
            throw new RuntimeException("Sunteti deja inscris la acest eveniment");
        }
        
        Participant participant = new Participant();
        participant.setNume(nume);
        participant.setPrenume(prenume);
        participant.setEmail(email);
        participant.setEveniment(eveniment);
        
        Participant savedParticipant = participantRepository.save(participant);
        
        try {
            emailService.sendEventInvitationEmail(savedParticipant);
        } catch (Exception e) {
            logger.error("Eroare la trimiterea email-ului: {}", e.getMessage());
        }
        
        return savedParticipant;
    }
    
    public List<Participant> getParticipantsByEveniment(Integer evenimentId) {
        return participantRepository.findByEvenimentId(evenimentId);
    }
    
    public long getNumarParticipanti(Integer evenimentId) {
        return participantRepository.countByEvenimentId(evenimentId);
    }
    
    public boolean esteInscris(Integer evenimentId, String email) {
        return participantRepository.existsByEvenimentIdAndEmail(evenimentId, email);
    }
}