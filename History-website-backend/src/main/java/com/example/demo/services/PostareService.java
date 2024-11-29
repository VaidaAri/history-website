package com.example.demo.services;

import com.example.demo.models.Postare;
import com.example.demo.repos.PostareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostareService {
    @Autowired
    PostareRepository postareRepository;

    public PostareRepository getAllPosts(){
        return postareRepository;
    }

    public void createPost(Postare newPost){
        postareRepository.save(newPost);
    }

    public void updatePost(Postare newPost){
        postareRepository.save(newPost);
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
