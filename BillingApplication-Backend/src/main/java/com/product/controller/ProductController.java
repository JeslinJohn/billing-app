package com.product.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.product.model.Product;
import com.product.service.ProductService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173/")
public class ProductController {
	
	@Autowired
	private ProductService productService;
	
	@PostMapping("/create")
	public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
		return new ResponseEntity<Product> (productService.createProduct(product), HttpStatus.CREATED);
	}
	
	@PostMapping("createlist")
	public ResponseEntity<List<Product>> createListOfProducts(@Valid @RequestBody List<Product> product){
		return new ResponseEntity<List<Product>> (productService.createMultipleProducts(product), HttpStatus.CREATED);
		
	}
	
	@GetMapping("/read/{id}")
	public ResponseEntity<Product> getProduct(@PathVariable int id) {
		return new ResponseEntity<Product> (productService.findProduct(id),HttpStatus.OK);
	}
	
	@GetMapping("/readlist")
	public ResponseEntity<List<Product>> allProducts(){
		return new ResponseEntity<List<Product>> (productService.listOfProducts(), HttpStatus.OK);
		
	}
	
	@PutMapping("/update/{id}")
		public ResponseEntity<Product> updateProduct(@RequestBody Product product, @PathVariable int id) {
			return new ResponseEntity<Product> (productService.updateProduct(product, id), HttpStatus.OK);
		}

	@DeleteMapping("/deleteall")
	public ResponseEntity<String> deleteAllProducts (){
		return new ResponseEntity<String> (productService.deleteProducts(), HttpStatus.ACCEPTED);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteProduct (@PathVariable int id){
		return new ResponseEntity<String> (productService.deleteProductById(id), HttpStatus.ACCEPTED);
	}
}
