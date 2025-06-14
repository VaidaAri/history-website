package com.example.demo.controllers;

import com.example.demo.models.Imagine;
import com.example.demo.services.ImagineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImagineController {

    @Autowired
    private ImagineService imagineService;

    @GetMapping
    public List<Imagine> getAllImages(){
        return imagineService.getAllImages();
    }

    @GetMapping("/{id}")
    public Imagine getImageById(@PathVariable Integer id){
        return imagineService.findImageById(id);
    }

    @PostMapping
    public void createImage(@RequestBody Imagine newImage){
        imagineService.createImage(newImage);
    }

    @PutMapping
    public void updateImage(@RequestBody Imagine updatedImage){
        imagineService.updateImage(updatedImage);
    }

    @DeleteMapping("/{id}")
    public void deleteImage(@PathVariable Integer id){
        imagineService.deleteImage(id);
    }

    private static final String UPLOAD_DIR = "uploads/";
    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile file, @RequestParam("description") String description) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Fișierul este gol"));
            }
            
            String originalFilename = file.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "_" + originalFilename;
            
            Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            Imagine image = new Imagine();
            image.setPath(fileName);
            image.setDescription(description);
            imagineService.createImage(image);

            Map<String, String> response = new HashMap<>();
            response.put("imagePath", image.getPath());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Eroare la încărcarea fișierului: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Eroare neașteptată: " + e.getMessage()));
        }
    }

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType != null ? contentType : "application/octet-stream")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
