package com.museumhistory.service;

import com.museumhistory.model.Rezervare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

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


    public void sendApprovalEmail(Rezervare rezervare) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, museumName);
            helper.setTo(rezervare.getEmail());
            helper.setSubject("Rezervarea dumneavoastră a fost confirmată - " + museumName);

            String htmlContent = createApprovalEmailTemplate(rezervare);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Eroare la trimiterea email-ului de confirmare", e);
        }
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
                    <h1>🎉 Rezervarea Confirmată!</h1>
                    <p>%s</p>
                </div>
                
                <div class="content">
                    <p>Bună ziua <strong>%s %s</strong>,</p>
                    
                    <p>Vă informăm că rezervarea dumneavoastră a fost <strong>confirmată cu succes</strong>!</p>
                    
                    <div class="details">
                        <h3>Detaliile vizitei confirmate:</h3>
                        <p><strong>Data și ora vizitei:</strong> %s</p>
                        <p><strong>Numărul de persoane:</strong> %d</p>
                        <p><strong>Categoria de vârstă:</strong> %s</p>
                        <p><strong>Ghid inclus:</strong> %s</p>
                    </div>
                    
                    <p>În cazul în care aveți nevoie să modificați sau să anulați rezervarea, vă rugăm să ne contactați cât mai curând posibil la adresa %s.</p>
                    
                    <p>Vă mulțumim pentru interesul acordat muzeului nostru și vă așteptăm cu mare drag!</p>
                    
                    <p>Cu stimă,<br><strong>Echipa muzeului</strong></p>
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
                getAgeGroupDisplayName(rezervare.getAgeGroup()),
                rezervare.isGuideRequired() ? "Da" : "Nu",
                fromEmail,
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


}