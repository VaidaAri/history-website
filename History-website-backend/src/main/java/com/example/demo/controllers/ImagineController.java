package com.example.demo.controllers;

import com.example.demo.models.Imagine;
import com.example.demo.services.ImagineService;
import org.springframework.beans.factory.annotation.Autowired;
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
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            Imagine image = new Imagine();
            image.setPath("/uploads/" + fileName);
            image.setDescription(description);
            imagineService.createImage(image);

            Map<String, String> response = new HashMap<>();
            response.put("imagePath", image.getPath());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

}
