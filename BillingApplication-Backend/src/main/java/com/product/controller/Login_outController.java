package com.product.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.product.model.AuthenticationResponse;
import com.product.model.Employee;
import com.product.service.EmployeeAuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173/")
public class Login_outController {
	
	@Autowired
	private EmployeeAuthService empAuthService;
	
	@PostMapping("/signup")
	@Transactional
	public ResponseEntity <AuthenticationResponse> register(@RequestBody Employee emp) {
		return ResponseEntity.ok( empAuthService.signup(emp));
		
	}
	
	@PostMapping("/login")
	public ResponseEntity<AuthenticationResponse> login(@RequestBody Employee emp) {
		return ResponseEntity.ok(empAuthService.verify(emp));
		
	}

}
