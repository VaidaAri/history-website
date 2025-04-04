package com.example.demo.services;

import com.example.demo.models.Postare;
import com.example.demo.repos.PostareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostareService {
    @Autowired
    PostareRepository postareRepository;

    public List<Postare> getAllPosts(){
        return postareRepository.findAll();
    }

    public void createPost(Postare newPost){
        // Asigurăm că createdAt e setat
        if (newPost.getCreatedAt() == null) {
            newPost.setCreatedAt(LocalDateTime.now());
        }
        postareRepository.save(newPost);
    }

    public void updatePost(Postare updatedPost){
        postareRepository.save(updatedPost);
    }

    public void deletePost(Integer postId){
        postareRepository.deleteById(postId);
    }

    public Postare findPostByID(Integer postId){
        return postareRepository.findById(postId)
                .orElseThrow(()
                -> new RuntimeException("Nu s-a gasit postare cu ID-ul:" + postId));
    }
}
