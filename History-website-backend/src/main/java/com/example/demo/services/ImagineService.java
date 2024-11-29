package com.example.demo.services;

import com.example.demo.models.Imagine;
import com.example.demo.repos.ImagineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImagineService {
    @Autowired
    ImagineRepository imagineRepository;

    public ImagineRepository getAllImages(){
        return imagineRepository;
    }

    public void createImage(Imagine newImage){
        imagineRepository.save(newImage);
    }

    public void updateImage(Imagine newImage){
        imagineRepository.save(newImage);
    }

    public void deleteImage(Integer imageId){
        imagineRepository.deleteById(imageId);
    }

    public Imagine findImageById(Integer imageId){
        return imagineRepository.findById(imageId)
                .orElseThrow(()
                -> new RuntimeException("Nu s-a gasit imagine cu ID-ul:" + imageId));
    }
}
