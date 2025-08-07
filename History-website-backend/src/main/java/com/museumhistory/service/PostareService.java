package com.museumhistory.service;

import com.museumhistory.model.Postare;
import com.museumhistory.model.Sectiune;
import com.museumhistory.repository.PostareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostareService {
    @Autowired
    PostareRepository postareRepository;

    public List<Postare> getAllPosts(){
        return postareRepository.findAll();
    }
    
    public List<Postare> getPostsBySectiune(Sectiune sectiune) {
        return postareRepository.findAll().stream()
                .filter(postare -> postare.getSectiune() != null && 
                        postare.getSectiune().getId().equals(sectiune.getId()))
                .collect(Collectors.toList());
    }
    
    public List<Postare> getPostsBySectiuneId(Integer sectiuneId) {
        return postareRepository.findAll().stream()
                .filter(postare -> postare.getSectiune() != null && 
                        postare.getSectiune().getId().equals(sectiuneId))
                .collect(Collectors.toList());
    }

    public void createPost(Postare newPost){
        if (newPost.getCreatedAt() == null) {
            newPost.setCreatedAt(LocalDateTime.now());
        }
        postareRepository.save(newPost);
    }

    public void updatePost(Postare updatedPost){
        Postare existent = findPostByID(updatedPost.getId());
        if (updatedPost.getSectiune() == null) {
            updatedPost.setSectiune(existent.getSectiune());
        }
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
