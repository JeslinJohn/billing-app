package com.product.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.product.model.Token;

@Repository
public interface TokenRepository extends JpaRepository<Token, Integer> {
	
	 @Query("""
			 select t from Token t inner join employee e on t.employee.id = e.id
			 where t.employee.id = :userId and t.loggedOut = false
			 """)
			     List<Token> findAllTokensByUser(Integer userId);

			     Optional<Token> findByToken(String token);

}
