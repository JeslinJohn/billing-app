package com.product.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.product.model.Employee;
import com.product.repository.EmployeeRepository;
import com.product.model.EmployeePrincipal;

@Service
public class EmployeeDetailsService  implements UserDetailsService {
	
	
	private final EmployeeRepository employeeRepo;
	
	

	public EmployeeDetailsService(EmployeeRepository employeerepo) {
		super();
		employeeRepo = employeerepo;
	}



	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		 Employee emp = employeeRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Employee not found" + username));
		 return new EmployeePrincipal(emp);
	}
	

}
