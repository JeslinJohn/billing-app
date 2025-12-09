package com.product.model;

import java.time.LocalDateTime;

public class ErrorResponse {
	
	private LocalDateTime timeStamp;
	private int code;
	private String error;
	private String message;
	
	public ErrorResponse(LocalDateTime timeStamp, int code, String error, String message) {
		super();
		this.timeStamp = timeStamp;
		this.code = code;
		this.error = error;
		this.message = message;
	}

	public ErrorResponse() {
		super();
	}

	public LocalDateTime getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(LocalDateTime timeStamp) {
		this.timeStamp = timeStamp;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
	

}
