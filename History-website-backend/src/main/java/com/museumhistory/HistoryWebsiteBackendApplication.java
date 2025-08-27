package com.museumhistory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HistoryWebsiteBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(HistoryWebsiteBackendApplication.class, args);
	}

}
