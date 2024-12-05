package com.example.demo.controllers;

import com.example.demo.models.Postare;
import com.example.demo.services.PostareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostareController {

    @Autowired
    private PostareService postareService;

    @GetMapping
    public List<Postare> getAllPosts(){
        return postareService.getAllPosts();
    }

    @GetMapping("/{id}")
    public Postare getPostById(@PathVariable Integer id){
        return postareService.findPostByID(id);
    }

    @PostMapping
    public void createPost(@RequestBody Postare newPost){
        postareService.createPost(newPost);
    }

    @PutMapping
    public void updatePost(@RequestBody Postare updatedPost){
        postareService.updatePost(updatedPost);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Integer id){
        postareService.deletePost(id);
    }
}
