/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.domain.session;
 
public class User {
 
    private final String username;
    private final String displayName;     
    private final char[] password;
    private final UserPreferences preferences;
    
    private final boolean accountExpired;
    private final boolean accountLocked;
    private final boolean credentialsExpired;
    private final boolean enabled;
    
    private final String clientCode;
    private final Long clientId;
    
    private final String employeeCode;
    private final Long employeeId;
    
    
    public User(String username, String displayName, String password,
            boolean accountExpired, boolean accountLocked, 
            boolean credentialsExpired, boolean enabled,
            String clientCode, Long clientId, UserPreferences preferences
            ,String employeeCode, Long employeeId ) {
        super();
        this.username = username;
        this.displayName = displayName;
        this.password = password.toCharArray();
        this.preferences = preferences;
        this.accountExpired = accountExpired;
        this.accountLocked = accountLocked;
        this.credentialsExpired = credentialsExpired;
        this.enabled = enabled;
        this.clientCode = clientCode;
        this.clientId = clientId;
        this.employeeCode = employeeCode;
        this.employeeId = employeeId;
        
    }

    
    public String getEmployeeCode() {
		return employeeCode;
	}


	public Long getEmployeeId() {
		return employeeId;
	}


	/**
     * @return the password
     */
    public char[] getPassword() {
        return this.password;
    }


    /**
     * @return the accountExpired
     */
    public boolean isAccountExpired() {
        return this.accountExpired;
    }

    /**
     * @return the accountLocked
     */
    public boolean isAccountLocked() {
        return this.accountLocked;
    }

    /**
     * @return the credentialsExpired
     */
    public boolean isCredentialsExpired() {
        return this.credentialsExpired;
    }

    /**
     * @return the enabled
     */
    public boolean isEnabled() {
        return this.enabled;
    }

    /**
     * @return the username
     */
    public String getUsername() {
        return this.username;
    }
     
    /**
     * @return the displayName
     */
    public String getDisplayName() {
        return this.displayName;
    }
     
    /**
     * @return the preferences
     */
    public UserPreferences getPreferences() {
        return this.preferences;
    }
     
    /**
     * @return the clientCode
     */
    public String getClientCode() {
        return this.clientCode;
    }
     
    /**
     * @return the clientId
     */
    public Long getClientId() {
        return this.clientId;
    }
     
    
    
    
}
