package com.product.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.product.model.AuthenticationResponse;
import com.product.model.Employee;
import com.product.model.Token;
import com.product.repository.EmployeeRepository;
import com.product.repository.TokenRepository;

@Service
public class EmployeeAuthService {
	
	
	private final EmployeeRepository empRepo;
	
	private final BCryptPasswordEncoder passwordEncrypt;
	
	private final AuthenticationManager authManager;
	
	private final JWTService jwtService;
	
	private final TokenRepository tokenRepo;
	
	

	public EmployeeAuthService(EmployeeRepository empRepo, BCryptPasswordEncoder passwordEncrypt,
			AuthenticationManager authManager, JWTService jwtService, TokenRepository tokenRepo) {
		super();
		this.empRepo = empRepo;
		this.passwordEncrypt = passwordEncrypt;
		this.authManager = authManager;
		this.jwtService = jwtService;
		this.tokenRepo = tokenRepo;
	}

	@Transactional
	public AuthenticationResponse signup (Employee request) {
		if(empRepo.findByUsername(request.getUsername()).isPresent()) {
			return new AuthenticationResponse(null, "User already Exists");
		}
		Employee emp = new Employee();
		emp.setFirstname(request.getFirstname());
		emp.setLastname(request.getLastname());
		emp.setEmail(request.getEmail());
		emp.setUsername(request.getUsername());
		emp.setPassword(passwordEncrypt.encode(request.getPassword()));
		emp.setRole(request.getRole());
		
		 emp = empRepo.save(emp);
		 
		 String jwt = jwtService.generateToken(emp.getUsername());
		 
		 saveUserToken(jwt, emp);
		 
		 return new AuthenticationResponse(jwt, "User registered successfully");
	}

	@Transactional
	public AuthenticationResponse verify(Employee request) {
		
		Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		if(!authentication.isAuthenticated()) {
			return new AuthenticationResponse(null, "Authentication failed");
		}
		
			Employee emp = empRepo.findByUsername(request.getUsername()).orElseThrow();
			String jwt = jwtService.generateToken(request.getUsername());
			revokeAllTokenByUser(emp);
			saveUserToken(jwt, emp);
			
		return new AuthenticationResponse(jwt, "user login successful");
	}
	
	private void saveUserToken(String jwt, Employee emp) {
		
		Token token = new Token();
		token.setToken(jwt);
		token.setLoggedOut(false);
		token.setEmployee(emp);
		tokenRepo.save(token);
		
	}
	
	private void revokeAllTokenByUser(Employee emp) {
        List<Token> validTokens = tokenRepo.findAllTokensByUser(emp.getId());
        if(validTokens.isEmpty()) {
            return;
        }

        validTokens.forEach(t-> {
            t.setLoggedOut(true);
        });

        tokenRepo.saveAll(validTokens);
    }
}
