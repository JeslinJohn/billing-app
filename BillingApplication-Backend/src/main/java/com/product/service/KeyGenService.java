package com.product.service;

import java.security.NoSuchAlgorithmException;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Encoders;

public class KeyGenService {
		
		private static String secretKey;
		
		public static void main(String[] args) throws NoSuchAlgorithmException {
				KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
				SecretKey key = Jwts.SIG.HS256.key().build();
		        String base64Key = Encoders.BASE64.encode(key.getEncoded());
				System.out.println(base64Key);
		}
		}
		
