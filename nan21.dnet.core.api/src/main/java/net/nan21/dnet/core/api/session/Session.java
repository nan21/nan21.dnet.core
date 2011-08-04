/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.api.session;

public class Session { 
    public static ThreadLocal<User> user = new ThreadLocal<User>();
    public static ThreadLocal<Params> params = new ThreadLocal<Params>();     
}
