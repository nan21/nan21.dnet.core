/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.api.session;

import java.text.SimpleDateFormat;

public class Params {

    private boolean defaultAccessAllow;
    private String defaultImportRootPath;
    private String adminRole;
    
    private String serverDateFormatMask;
    private SimpleDateFormat serverDateFormat;
    
     
    
    public Params() {
        super();
        this.serverDateFormatMask = "yyyy-MM-dd kk:mm";
        this.serverDateFormat = new SimpleDateFormat(this.serverDateFormatMask);
    }

    /**
     * @return the serverDateFormatMask
     */
    public String getServerDateFormatMask() {
        return this.serverDateFormatMask;
    }
 
    /**
     * @return the serverDateFormat
     */
    public SimpleDateFormat getServerDateFormat() {
        return this.serverDateFormat;
    }

    /**
     * @return the defaultImportRootPath
     */
    public String getDefaultImportRootPath() {
        return this.defaultImportRootPath;
    }

    /**
     * @param defaultImportRootPath the defaultImportRootPath to set
     */
    public void setDefaultImportRootPath(String defaultImportRootPath) {
        this.defaultImportRootPath = defaultImportRootPath;
    }

    /**
     * @return the defaultAccessAllow
     */
    public boolean isDefaultAccessAllow() {
        return this.defaultAccessAllow;
    }

    /**
     * @param defaultAccessAllow the defaultAccessAllow to set
     */
    public void setDefaultAccessAllow(boolean defaultAccessAllow) {
        this.defaultAccessAllow = defaultAccessAllow;
    }

    /**
     * @return the adminRole
     */
    public String getAdminRole() {
        return this.adminRole;
    }

    /**
     * @param adminRole the adminRole to set
     */
    public void setAdminRole(String adminRole) {
        this.adminRole = adminRole;
    }
    
    
}
