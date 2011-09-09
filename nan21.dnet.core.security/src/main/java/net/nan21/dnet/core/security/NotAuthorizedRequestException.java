/*
 * DNet eBusiness Suite
 * Project: dnet-web-core 
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.security ;

public class NotAuthorizedRequestException extends Exception {

    private static final long serialVersionUID = 1L;

    public NotAuthorizedRequestException(String message) {
         super(message);
    }

}