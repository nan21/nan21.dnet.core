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
    private String defaultImportPath;
    private String defaultExportPath;
    private String tempPath;
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

     

    public String getDefaultImportPath() {
		return defaultImportPath;
	}

	public void setDefaultImportPath(String defaultImportPath) {
		this.defaultImportPath = defaultImportPath;
	}

	public String getDefaultExportPath() {
		return defaultExportPath;
	}

	public void setDefaultExportPath(String defaultExportPath) {
		this.defaultExportPath = defaultExportPath;
	}

	public String getTempPath() {
		return tempPath;
	}

	public void setTempPath(String tempPath) {
		this.tempPath = tempPath;
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

	public void setServerDateFormat(SimpleDateFormat serverDateFormat) {
		this.serverDateFormat = serverDateFormat;
	}
    
    
}
