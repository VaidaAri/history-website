package com.museumhistory.controller;

import com.museumhistory.model.Postare;
import com.museumhistory.service.PostareService;
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
    
    @GetMapping("/sectiune/{sectiuneId}")
    public List<Postare> getPostsBySectiune(@PathVariable Integer sectiuneId) {
        return postareService.getPostsBySectiuneId(sectiuneId);
    }

    @PostMapping
    public Postare createPost(@RequestBody Postare newPost){
        try {
            postareService.createPost(newPost);
            return newPost;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Eroare la crearea postării: " + e.getMessage());
        }
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
