package com.product.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.product.security.filter.JWTFilter;
import com.product.service.EmployeeDetailsService;

import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private EmployeeDetailsService employeeDetailsService;
	@Autowired
	private JWTFilter jwtFilter;
	@Autowired
	private CustomLogoutHandler logouthandler;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		
		return http.csrf(customizer -> customizer.disable()).
		cors(cors -> cors.configurationSource(corsConfigurationSource())).
		authorizeHttpRequests(request -> request.requestMatchers("/auth/login").permitAll().
		requestMatchers("/auth/signup").hasRole("ADMIN").
		anyRequest().authenticated()).
		sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).
		authenticationProvider(authenticationProvider()).
		addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).
		exceptionHandling(c ->c.accessDeniedHandler((request, response, accessDeniedException)->response.setStatus(403)).
		authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))).
		logout(l-> l.logoutUrl("/logout").
		addLogoutHandler(logouthandler).
		logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext()))
		.build();
	}
	
	@Bean
	AuthenticationProvider authenticationProvider() {
	DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
	provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
	provider.setUserDetailsService(employeeDetailsService);
	
	return provider;
	}
	
	@Bean
	BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(12);
	}
	
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration cors = new CorsConfiguration();
		cors.setAllowedOrigins(List.of("http://localhost:5173"));
		cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		cors.setAllowedHeaders(List.of("*"));
		cors.setExposedHeaders(List.of("Authorization", "Content-Type"));
		cors.setAllowCredentials(true);
		cors.setMaxAge(3600L);
		
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", cors);
		return source;
	}
	
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
		
	}
}
