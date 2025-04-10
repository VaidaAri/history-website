package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configurare pentru a permite accesul la fișierele statice din directorul "static/images"
        registry.addResourceHandler("/static/images/**")
                .addResourceLocations("classpath:/static/images/");
                
        // Configurare pentru a permite accesul la fișierele din directorul "uploads"
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}