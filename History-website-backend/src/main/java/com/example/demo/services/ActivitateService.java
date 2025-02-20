package com.example.demo.services;

import com.example.demo.models.Activitate;
import com.example.demo.repos.ActivitateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ActivitateService {
    @Autowired
    ActivitateRepository activitateRepository;

    public List<Activitate> getAllActivities() {
        return activitateRepository.findAll();
    }

    public void createActivity(Activitate newActivity){
        activitateRepository.save(newActivity);
    }

    public void updateActivity(Activitate updatedActivity){
        activitateRepository.save(updatedActivity);
    }

    public void deleteActivity(Integer activityId){
        activitateRepository.deleteById(activityId);
    }

    public Activitate findActivityById(Integer activityId){
        return activitateRepository.findById(activityId)
                .orElseThrow(()
                -> new RuntimeException("Nu s-a gasit activitate cu ID-ul: " + activityId));
    }

}
