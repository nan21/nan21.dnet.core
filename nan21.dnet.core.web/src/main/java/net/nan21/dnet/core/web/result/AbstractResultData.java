/*
 * DNet eBusiness Suite
 * Project: dnet-web-core 
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.web.result;

/**
 * Abstract superclass for all result-data types.
 * 
 * @author amathe
 * 
 */
public abstract class AbstractResultData {

	/**
	 * Indicates if the operation was successful. If not successful a
	 * descriptive message may be sent.
	 */
	private boolean success = true;

	/**
	 * Message with extra information about the operation.
	 * 
	 */
	private String message;

	/**
	 * Total execution time of the request expressed in milliseconds. Returns -1
	 * if the execution time measurement is disabled.
	 */
	private long executionTime = -1;

	/**
	 * @return the success
	 */
	public boolean isSuccess() {
		return this.success;
	}

	/**
	 * @param success
	 *            the success to set
	 */
	public void setSuccess(boolean success) {
		this.success = success;
	}

	/**
	 * @return the message
	 */
	public String getMessage() {
		return this.message;
	}

	/**
	 * @param message
	 *            the message to set
	 */
	public void setMessage(String message) {
		this.message = message;
	}

	public long getExecutionTime() {
		return executionTime;
	}

	public void setExecutionTime(long executionTime) {
		this.executionTime = executionTime;
	}

}
