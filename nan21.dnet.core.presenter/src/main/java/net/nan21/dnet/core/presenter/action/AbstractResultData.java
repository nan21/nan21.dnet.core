/*
 * DNet eBusiness Suite
 * Project: dnet-web-core 
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.presenter.action;

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

}
