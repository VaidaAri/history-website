package com.example.demo.services;

import com.example.demo.models.Activitate;
import com.example.demo.repos.ActivitateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ActivitateService {
    @Autowired
    ActivitateRepository activitateRepository;

    public ActivitateRepository getAllActivities() {
        return activitateRepository;
    }

    public void CreateActivitate(Activitate newActivity){
        activitateRepository.save(newActivity);
    }

    public void UpdateActivitate(Activitate newActivity){
        activitateRepository.save(newActivity);
    }

    public void DeleteActivitate(Integer activityId){
        activitateRepository.deleteById(activityId);
    }

    public Activitate findActivityById(Integer activityId){
        return activitateRepository.findById(activityId)
                .orElseThrow(()
                -> new RuntimeException("Nu s-a gasit activitate cu ID-ul: " + activityId));
    }

}
