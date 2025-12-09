package com.product.service;

import java.util.List;
import com.product.exception.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.product.exception.ProductAlreadyExistsException;
import com.product.exception.ProductNotFoundException;
import com.product.model.Product;
import com.product.repository.ProductRepository;

import jakarta.validation.Valid;

@Service
@Validated
public class ProductService {

@Autowired
private ProductRepository productRepo;

public Product createProduct(@Valid Product product) {
	Optional <Product> existingProduct  = productRepo.findById(product.getProduct_id());
	 if(!existingProduct.isPresent()) {
		 return productRepo.save(product);
	 } else {
		 throw new ProductAlreadyExistsException("A product already exists with Id: " + product.getProduct_id() + " & Name: "+ product.getProduct_name());
	 }
	
}

public List<Product> createMultipleProducts(@Valid List<Product> products) {
	
	for(Product product: products) {
		Optional <Product> existingProduct  = productRepo.findById(product.getProduct_id());
		 if(!existingProduct.isPresent()) {
			 return productRepo.saveAll(products);
	}else {
		throw new ProductAlreadyExistsException("A product already exists with Id: " + product.getProduct_id() + " & Name: "+ product.getProduct_name());
	}
	
	}
	return products;
}

public Product findProduct(int product_id) {
	
	return productRepo.findById(product_id).orElseThrow(
            () -> new NoSuchElementException("No product exists with Id: " + product_id));
    
}

public List<Product> listOfProducts(){
	if (productRepo.count() == 0) {
        throw new ProductNotFoundException("No Product Available");
    } else {
	
	return (List<Product>) productRepo.findAll();
    }
}

public Product updateProduct (Product product, int prod_id) {
	
	Optional<Product> p = productRepo.findById(prod_id);
	if (p.isPresent()) {
	 p.get().setSerial_no(p.get().getSerial_no());
	 p.get().setProduct_name(p.get().getProduct_name());
	 p.get().setProduct_quantity(p.get().getProduct_quantity());
	 p.get().setProduct_price(p.get().getProduct_price());
	 p.get().setTotal_price(p.get().getTotal_price());
	 
	 return productRepo.save(product);
	} else {
		throw new NoSuchElementException("No product exists with Id: " + product.getProduct_id());
	}
}

public String deleteProducts(){
	if (productRepo.count() == 0) {
        // If no products are found, throw a custom exception
        throw new ProductNotFoundException("No products found to delete.");
    } else {
	productRepo.deleteAll();
	 return "All Products deleted";
    }
}

public String deleteProductById(int id){
	Optional<Product> existingProd = productRepo.findById(id);
	if (existingProd.isPresent()) {
	productRepo.deleteById(id);
	 return "Product Id: "+ id + " deleted";
}
	else {
		throw new NoSuchElementException("No product exists with Id: " + id + " for deletion");
	}
}
}
