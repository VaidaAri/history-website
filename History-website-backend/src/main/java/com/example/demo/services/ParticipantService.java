package com.example.demo.services;

import com.example.demo.models.Eveniment;
import com.example.demo.models.Participant;
import com.example.demo.repos.EvenimentRepository;
import com.example.demo.repos.ParticipantRepository;
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
        System.out.println("ParticipantService - inscriereEveniment called with: evenimentId=" + evenimentId + ", nume=" + nume + ", prenume=" + prenume + ", email=" + email);
        
        // Verificăm dacă evenimentul există
        Eveniment eveniment = evenimentRepository.findById(evenimentId)
            .orElseThrow(() -> new RuntimeException("Evenimentul cu ID-ul " + evenimentId + " nu a fost găsit"));
        
        System.out.println("Eveniment găsit: " + eveniment.getName());
        
        // Verificăm dacă utilizatorul nu este deja înscris
        if (participantRepository.existsByEvenimentIdAndEmail(evenimentId, email)) {
            throw new RuntimeException("Sunteți deja înscris la acest eveniment");
        }
        
        System.out.println("Utilizatorul nu este deja înscris, continuăm...");
        
        // Creăm și salvăm participantul
        Participant participant = new Participant();
        participant.setNume(nume);
        participant.setPrenume(prenume);
        participant.setEmail(email);
        participant.setEveniment(eveniment);
        
        System.out.println("Salvăm participantul în baza de date...");
        Participant savedParticipant = participantRepository.save(participant);
        System.out.println("Participant salvat cu ID: " + savedParticipant.getId());
        
        // Trimitem email-ul de invitație
        try {
            System.out.println("Trimitem email-ul de invitație...");
            emailService.sendEventInvitationEmail(savedParticipant);
            System.out.println("Email trimis cu succes!");
        } catch (Exception e) {
            System.err.println("Eroare la trimiterea email-ului: " + e.getMessage());
            // Nu aruncăm exceptie aici pentru că participantul a fost deja salvat
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