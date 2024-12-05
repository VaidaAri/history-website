package com.example.demo.controllers;

import com.example.demo.models.Activitate;
import com.example.demo.services.ActivitateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivitateController {

    @Autowired
    private ActivitateService activitateService;

    @GetMapping
    public List<Activitate> getAllActivities() {
        return activitateService.getAllActivities();
    }

    @GetMapping("/{id}")
    public Activitate getActivityById(@PathVariable Integer id) {
        return activitateService.findActivityById(id);
    }

    @PostMapping
    public void createActivity(@RequestBody Activitate newActivity) {
        activitateService.createActivitate(newActivity);
    }

    @PutMapping
    public void updateActivity(@RequestBody Activitate updatedActivity) {
        activitateService.updateActivitate(updatedActivity);
    }

    @DeleteMapping("/{id}")
    public void deleteActivity(@PathVariable Integer id) {
        activitateService.deleteActivitate(id);
    }
}
