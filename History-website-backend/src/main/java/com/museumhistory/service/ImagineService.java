package com.museumhistory.service;

import com.museumhistory.model.Imagine;
import com.museumhistory.repository.ImagineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ImagineService {
    @Autowired
    ImagineRepository imagineRepository;

    public List<Imagine> getAllImages(){
        return imagineRepository.findAllByOrderByPositionAsc();
    }

    public void createImage(Imagine newImage){
        imagineRepository.save(newImage);
    }

    public void updateImage(Imagine updatedImage){
        imagineRepository.save(updatedImage);
    }

    public void deleteImage(Integer imageId){
        Imagine imagine = findImageById(imageId);
        
        if (imagine.getPath() != null && !imagine.getPath().trim().isEmpty()) {
            try {
                Path filePath = Paths.get("uploads/").resolve(imagine.getPath()).normalize();
                Files.deleteIfExists(filePath);
                System.out.println("Fișier șters de pe disk: " + filePath);
            } catch (IOException e) {
                System.err.println("Eroare la ștergerea fișierului: " + imagine.getPath());
                e.printStackTrace();
            }
        }
        
        imagineRepository.deleteById(imageId);
    }

    public Imagine findImageById(Integer imageId){
        return imagineRepository.findById(imageId)
                .orElseThrow(()
                -> new RuntimeException("Nu s-a gasit imagine cu ID-ul:" + imageId));
    }
}
