package com.example.demo.controllers;

import com.example.demo.models.Imagine;
import com.example.demo.services.ImagineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

}
