package com.product.exception;

import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.product.model.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

@ExceptionHandler(value = ProductAlreadyExistsException.class)
@ResponseStatus(HttpStatus.CONFLICT)
@ResponseBody ErrorResponse
 handleAlreadyExistsException(ProductAlreadyExistsException ex){
	return new ErrorResponse(LocalDateTime.now(),HttpStatus.CONFLICT.value(), ex.getMessage(), "Product Already Exists, Add new product") {
	};
}
@ExceptionHandler(value = NoSuchElementException.class)
@ResponseStatus(HttpStatus.NOT_FOUND)
@ResponseBody ErrorResponse
 handleNoSuchElementException(NoSuchElementException ex){
	return new ErrorResponse(LocalDateTime.now(),HttpStatus.NOT_FOUND.value(), ex.getMessage(), "No product exists with Id, Please enter the correct product ID ") {
	};
}
@ExceptionHandler(value = ProductNotFoundException.class)
@ResponseStatus(HttpStatus.NOT_FOUND)
@ResponseBody ErrorResponse
 handleResourcesNotFoundException(ProductNotFoundException ex){
	return new ErrorResponse(LocalDateTime.now(),HttpStatus.NOT_FOUND.value(), ex.getMessage(), "Add new product information") {
	};
}

@ExceptionHandler(value = Exception.class)
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
@ResponseBody ErrorResponse
 handleAllExceptions(Exception ex) {

	return new ErrorResponse(LocalDateTime.now(),HttpStatus.NOT_FOUND.value(), ex.getMessage(), "Unknown Error ") {
	};
}
}
