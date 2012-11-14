package net.nan21.dnet.core.api.exceptions;

public class BusinessException extends Exception {

	private static final long serialVersionUID = 1L;

	private String errorCode;
	private String errorDetails;

	public BusinessException(String errorCode) {
		super(errorCode);
		this.errorCode = errorCode;
	}

	public BusinessException(String errorCode, String errorDetails) {
		super(errorCode + " \n" + errorDetails);
		this.errorCode = errorCode;
		this.errorDetails = errorDetails;
	}

	public BusinessException(String errorCode, Throwable exception) {
		super(errorCode);
		this.initCause(exception);
	}

	public BusinessException(String errorCode, String errorDetails,
			Throwable exception) {
		super(errorCode + " \n" + errorDetails);
		this.initCause(exception);
		this.errorCode = errorCode;
		this.errorDetails = errorDetails;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorDetails() {
		return errorDetails;
	}

	public void setErrorDetails(String errorDetails) {
		this.errorDetails = errorDetails;
	}

}
