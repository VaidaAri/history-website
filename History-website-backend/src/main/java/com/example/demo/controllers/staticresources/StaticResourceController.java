package com.example.demo.controllers.staticresources;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@RestController
@RequestMapping("/api/staticresources")
@CrossOrigin(origins = "http://localhost:4200")
public class StaticResourceController {

    @GetMapping("/images/{folder}/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String folder, @PathVariable String filename) {
        try {
            // Decodează folder-ul și filename-ul pentru a gestiona spațiile și caracterele speciale
            String decodedFolder = URLDecoder.decode(folder, StandardCharsets.UTF_8.name());
            String decodedFilename = URLDecoder.decode(filename, StandardCharsets.UTF_8.name());
            
            // Incarcă imaginea din directorul static/images
            Resource resource = new ClassPathResource("static/images/" + decodedFolder + "/" + decodedFilename);
            byte[] imageBytes = Files.readAllBytes(resource.getFile().toPath());
            
            // Determină tipul de conținut pentru a seta header-ul corect
            String contentType = determineContentType(decodedFilename);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imageBytes);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
    
    // Endpoint pentru a obține o listă de imagini dintr-un folder
    @GetMapping("/images/{folder}")
    public ResponseEntity<String[]> getImagesFromFolder(@PathVariable String folder) {
        try {
            String decodedFolder = URLDecoder.decode(folder, StandardCharsets.UTF_8.name());
            Resource resource = new ClassPathResource("static/images/" + decodedFolder);
            String[] fileNames = resource.getFile().list();
            
            return ResponseEntity.ok(fileNames);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    private String determineContentType(String filename) {
        if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (filename.toLowerCase().endsWith(".gif")) {
            return "image/gif";
        }
        return "application/octet-stream";
    }
}