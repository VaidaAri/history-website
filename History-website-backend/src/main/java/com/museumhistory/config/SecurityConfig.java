package com.museumhistory.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints - anyone can access
                .requestMatchers("/api/administrators/login").permitAll()
                .requestMatchers("/api/administrators/validate-token").permitAll()
                
                // Public read-only endpoints for museum visitors
                .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/expozitii/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/sectiuni/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/postari/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/imagini/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/images/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/staticresources/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/museum-schedule/**").permitAll()
                
                // Public endpoints for visitors to make reservations
                .requestMatchers(HttpMethod.POST, "/api/rezervari").permitAll()
                .requestMatchers("/api/rezervari/confirm/**").permitAll()
                
                // Static resources and uploads
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/static/**").permitAll()
                .requestMatchers("/images/**").permitAll()
                
                // Admin-only endpoints - require authentication
                .requestMatchers("/api/administrators/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/events/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/events/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/expozitii/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/expozitii/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/expozitii/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/postari/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/postari/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/postari/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/posts/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/posts/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/posts/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/sectiuni/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/sectiuni/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/sectiuni/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/imagini/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/imagini/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/imagini/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/images/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/images/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/images/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/rezervari/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/rezervari/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/rezervari/**").hasRole("ADMIN")
                .requestMatchers("/api/museum-schedule/**").hasRole("ADMIN")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:4200", "http://127.0.0.1:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}