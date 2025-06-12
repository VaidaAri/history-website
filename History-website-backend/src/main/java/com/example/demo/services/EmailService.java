package com.example.demo.services;

import com.example.demo.models.Participant;
import com.example.demo.models.Rezervare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${museum.email.from}")
    private String fromEmail;

    @Value("${museum.email.name}")
    private String museumName;

    @Value("${museum.frontend.url}")
    private String frontendUrl;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm");

    public String generateConfirmationToken() {
        return UUID.randomUUID().toString();
    }

    public void sendConfirmationEmail(Rezervare rezervare) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, museumName);
            helper.setTo(rezervare.getEmail());
            helper.setSubject("Confirmați rezervarea dumneavoastră - " + museumName);

            String htmlContent = createConfirmationEmailTemplate(rezervare);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Eroare la trimiterea email-ului de confirmare", e);
        }
    }

    public void sendApprovalEmail(Rezervare rezervare) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, museumName);
            helper.setTo(rezervare.getEmail());
            helper.setSubject("Rezervarea dumneavoastră a fost aprobată - " + museumName);

            String htmlContent = createApprovalEmailTemplate(rezervare);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Eroare la trimiterea email-ului de aprobare", e);
        }
    }

    public void sendRejectionEmail(Rezervare rezervare, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, museumName);
            helper.setTo(rezervare.getEmail());
            helper.setSubject("Rezervarea dumneavoastră nu a putut fi aprobată - " + museumName);

            String htmlContent = createRejectionEmailTemplate(rezervare, reason);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Eroare la trimiterea email-ului de respingere", e);
        }
    }

    private String createConfirmationEmailTemplate(Rezervare rezervare) {
        String confirmationUrl = frontendUrl + "/confirm-reservation/" + rezervare.getConfirmationToken();
        
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Confirmați rezervarea</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #7D5A50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                    .button { display: inline-block; background-color: #EAD196; color: #5D4037; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
                    .details { background-color: white; padding: 15px; border-left: 4px solid #7D5A50; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>%s</h1>
                    <p>Confirmați rezervarea dumneavoastră</p>
                </div>
                
                <div class="content">
                    <p>Bună ziua <strong>%s %s</strong>,</p>
                    
                    <p>Mulțumim pentru rezervarea făcută la muzeul nostru! Pentru a finaliza rezervarea, vă rugăm să confirmați adresa de email făcând click pe butonul de mai jos:</p>
                    
                    <div style="text-align: center;">
                        <a href="%s" class="button">CONFIRMĂ REZERVAREA</a>
                    </div>
                    
                    <div class="details">
                        <h3>Detaliile rezervării:</h3>
                        <p><strong>Data și ora vizitei:</strong> %s</p>
                        <p><strong>Numărul de persoane:</strong> %d</p>
                        <p><strong>Categoria de vârstă:</strong> %s</p>
                        <p><strong>Ghid solicitat:</strong> %s</p>
                        <p><strong>Email contact:</strong> %s</p>
                    </div>
                    
                    <p><strong>Important:</strong> Acest link este valabil timp de 24 de ore. Dacă nu confirmați rezervarea în acest interval, aceasta va fi anulată automat.</p>
                    
                    <p>Pentru întrebări sau modificări, ne puteți contacta la adresa de email %s.</p>
                    
                    <p>Vă mulțumim și vă așteptăm cu drag la muzeu!</p>
                </div>
                
                <div class="footer">
                    <p>Acest email a fost trimis automat. Vă rugăm să nu răspundeți la acest mesaj.</p>
                    <p>%s</p>
                </div>
            </body>
            </html>
            """.formatted(
                museumName,
                rezervare.getNume(), rezervare.getPrenume(),
                confirmationUrl,
                rezervare.getDatetime().format(dateFormatter),
                rezervare.getNumberOfPersons(),
                getAgeGroupDisplayName(rezervare.getAgeGroup()),
                rezervare.isGuideRequired() ? "Da" : "Nu",
                rezervare.getEmail(),
                fromEmail,
                museumName
            );
    }

    private String createApprovalEmailTemplate(Rezervare rezervare) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Rezervarea aprobată</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #28A745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                    .details { background-color: white; padding: 15px; border-left: 4px solid #28A745; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🎉 Rezervarea Aprobată!</h1>
                    <p>%s</p>
                </div>
                
                <div class="content">
                    <p>Bună ziua <strong>%s %s</strong>,</p>
                    
                    <p>Vă informăm cu bucurie că rezervarea dumneavoastră a fost <strong>aprobată</strong>!</p>
                    
                    <div class="details">
                        <h3>Detaliile vizitei confirmate:</h3>
                        <p><strong>Data și ora vizitei:</strong> %s</p>
                        <p><strong>Numărul de persoane:</strong> %d</p>
                        <p><strong>Ghid inclus:</strong> %s</p>
                    </div>
                    
                    <p>În cazul în care aveți nevoie să modificați sau să anulați rezervarea, vă rugăm să ne contactați cât mai curând posibil la adresa %s.</p>
                    
                    <p>Vă mulțumim pentru interesul acordat muzeului nostru și vă așteptăm cu mare drag!</p>
                    
                    <p>Cu stimă,<br><strong>Echipa %s</strong></p>
                </div>
                
                <div class="footer">
                    <p>Acest email a fost trimis automat. Pentru întrebări, contactați-ne la %s</p>
                </div>
            </body>
            </html>
            """.formatted(
                museumName,
                rezervare.getNume(), rezervare.getPrenume(),
                rezervare.getDatetime().format(dateFormatter),
                rezervare.getNumberOfPersons(),
                rezervare.isGuideRequired() ? "Da" : "Nu",
                fromEmail,
                museumName,
                fromEmail
            );
    }

    private String createRejectionEmailTemplate(Rezervare rezervare, String reason) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Rezervarea nu a putut fi aprobată</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #C14953; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                    .details { background-color: white; padding: 15px; border-left: 4px solid #C14953; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Rezervarea nu a putut fi aprobată</h1>
                    <p>%s</p>
                </div>
                
                <div class="content">
                    <p>Bună ziua <strong>%s %s</strong>,</p>
                    
                    <p>Ne pare rău să vă informăm că rezervarea dumneavoastră pentru data de <strong>%s</strong> nu a putut fi aprobată.</p>
                    
                    <div class="details">
                        <h3>Motivul:</h3>
                        <p>%s</p>
                    </div>
                    
                    <p>Vă încurajăm să faceți o nouă rezervare pentru o altă dată sau să ne contactați pentru a discuta alternative.</p>
                    
                    <p>Ne cerem scuze pentru neplăcerile create și vă mulțumim pentru înțelegere.</p>
                    
                    <p>Pentru orice întrebări sau pentru a face o nouă rezervare, ne puteți contacta la %s.</p>
                    
                    <p>Cu stimă,<br><strong>Echipa %s</strong></p>
                </div>
                
                <div class="footer">
                    <p>Acest email a fost trimis automat. Pentru întrebări, contactați-ne la %s</p>
                </div>
            </body>
            </html>
            """.formatted(
                museumName,
                rezervare.getNume(), rezervare.getPrenume(),
                rezervare.getDatetime().format(dateFormatter),
                reason != null ? reason : "Intervalul orar solicitat nu este disponibil.",
                fromEmail,
                museumName,
                fromEmail
            );
    }

    private String getAgeGroupDisplayName(String ageGroup) {
        if (ageGroup == null || ageGroup.trim().isEmpty()) {
            return "Nespecificată";
        }
        
        switch (ageGroup) {
            case "COPII": return "Copii (0-12 ani)";
            case "ADOLESCENTI": return "Adolescenți (13-17 ani)";
            case "ADULTI": return "Adulți (18-64 ani)";
            case "SENIORI": return "Seniori (65+ ani)";
            case "MIXT": return "Grup mixt";
            default: return ageGroup;
        }
    }

    public void sendEventInvitationEmail(Participant participant) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, museumName);
            helper.setTo(participant.getEmail());
            helper.setSubject("Invitație eveniment - " + participant.getEveniment().getName() + " - " + museumName);

            String htmlContent = createEventInvitationTemplate(participant);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Eroare la trimiterea email-ului de invitație", e);
        }
    }

    private String createEventInvitationTemplate(Participant participant) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Invitație oficială la eveniment</title>
                <style>
                    body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
                    .invitation-card { background-color: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); overflow: hidden; border: 3px solid #7D5A50; }
                    .header { background: linear-gradient(135deg, #7D5A50 0%%, #5D4037 100%%); color: white; padding: 30px 20px; text-align: center; position: relative; }
                    .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"><circle cx="25" cy="25" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%%23grain)"/></svg>'); opacity: 0.3; }
                    .header h1 { margin: 0 0 10px 0; font-size: 2.2em; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); position: relative; z-index: 1; }
                    .header .subtitle { font-size: 1.1em; margin: 0; font-style: italic; position: relative; z-index: 1; }
                    .invitation-content { padding: 40px 30px; }
                    .guest-name { text-align: center; font-size: 1.4em; color: #7D5A50; margin-bottom: 30px; font-weight: bold; }
                    .event-details { background: linear-gradient(135deg, #f8f4e3 0%%, #ead196 100%%); padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px dashed #7D5A50; position: relative; }
                    .event-details::before { content: '🎫'; position: absolute; top: -15px; right: 20px; background: white; padding: 5px 10px; border-radius: 50%%; font-size: 1.5em; }
                    .event-title { font-size: 1.8em; color: #5D4037; margin-bottom: 20px; text-align: center; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
                    .detail-row { display: flex; align-items: center; margin: 15px 0; font-size: 1.1em; }
                    .detail-icon { font-size: 1.3em; margin-right: 15px; width: 30px; }
                    .detail-text { font-weight: 500; color: #333; }
                    .access-code { background: #7D5A50; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 25px 0; }
                    .access-code-label { font-size: 0.9em; margin-bottom: 5px; opacity: 0.9; }
                    .access-code-value { font-size: 1.3em; font-weight: bold; letter-spacing: 3px; font-family: 'Courier New', monospace; }
                    .qr-placeholder { text-align: center; margin: 25px 0; padding: 20px; background: #f0f0f0; border-radius: 10px; }
                    .important-note { background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
                    .signature { margin-top: 30px; text-align: right; font-style: italic; color: #666; }
                </style>
            </head>
            <body>
                <div class="invitation-card">
                    <div class="header">
                        <h1>🏛️ INVITAȚIE OFICIALĂ</h1>
                        <p class="subtitle">%s</p>
                    </div>
                    
                    <div class="invitation-content">
                        <div class="guest-name">
                            🎭 Invitat: %s %s 🎭
                        </div>
                        
                        <p style="text-align: center; font-size: 1.1em; margin-bottom: 30px;">
                            Aveți onoarea de a fi invitat(ă) la următorul eveniment cultural:
                        </p>
                        
                        <div class="event-details">
                            <div class="event-title">%s</div>
                            
                            <div class="detail-row">
                                <span class="detail-icon">📅</span>
                                <span class="detail-text">%s - %s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-icon">📍</span>
                                <span class="detail-text">%s</span>
                            </div>
                            
                            %s
                        </div>
                        
                        <div class="access-code">
                            <div class="access-code-label">Cod de acces eveniment:</div>
                            <div class="access-code-value">INV-%s</div>
                        </div>
                        
                        <div class="qr-placeholder">
                            <div style="font-size: 3em; margin-bottom: 10px;">📱</div>
                            <p><strong>Prezentați această invitație la intrare</strong><br>
                            Salvați acest email sau printați-l pentru acces</p>
                        </div>
                        
                        <div class="important-note">
                            <strong>⚠️ Important:</strong> Această invitație este personală și netransmisibilă. 
                            Vă rugăm să păstrați acest email pentru a putea accesa evenimentul.
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0; font-size: 1.1em;">
                            Vă așteptăm cu mare drag la acest eveniment special! 🌟
                        </div>
                        
                        <div class="signature">
                            Cu deosebită considerație,<br>
                            <strong>Echipa %s</strong><br>
                            <em>Organizatorul evenimentului</em>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p style="margin: 0; font-size: 0.9em; color: #666;">
                            Această invitație a fost generată automat • Pentru întrebări: %s
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                museumName,
                participant.getNume(), participant.getPrenume(),
                participant.getEveniment().getName(),
                participant.getEveniment().getStartDate().format(dateFormatter),
                participant.getEveniment().getEndDate().format(dateFormatter),
                participant.getEveniment().getLocation(),
                participant.getEveniment().getDescription() != null && !participant.getEveniment().getDescription().isEmpty() 
                    ? "<div class=\"detail-row\"><span class=\"detail-icon\">📝</span><span class=\"detail-text\">" + participant.getEveniment().getDescription() + "</span></div>" 
                    : "",
                String.format("%06d", participant.getId() != null ? participant.getId() : (int)(Math.random() * 999999)),
                museumName,
                fromEmail
            );
    }
}