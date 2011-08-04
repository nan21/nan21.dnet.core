/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.security;


/**
 * ThreadLocal variables used to send extra login parameters to {@link DbUserService}.
 * 
 * @author AMATHE
 *
 */
public class DefaultLoginAuthParams {
    /**
     * Client to connect to.  
     */
    public static ThreadLocal<String> clientCode = new ThreadLocal<String>(); 
    /**
     * Language.
     */
    public static ThreadLocal<String> language = new ThreadLocal<String>();
}
