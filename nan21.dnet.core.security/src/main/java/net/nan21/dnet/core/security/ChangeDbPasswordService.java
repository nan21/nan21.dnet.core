/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.security;

import net.nan21.dnet.core.api.session.IChangePasswordService;

import org.springframework.jdbc.core.support.JdbcDaoSupport;

public class ChangeDbPasswordService extends JdbcDaoSupport implements IChangePasswordService {

    private String sql;
    
    public void changePassword(String userName, String newPassword,
			String oldPassword, Long clientId, String clientCode) throws Exception {
    	if (this.sql==null) {
    		throw new Exception("Invalid configuration of change password service. Sql statement not specified in bean definition.");
    	}
        int i = this.getJdbcTemplate().update(this.sql, newPassword, userName, clientId);
        if (i==0) {
            throw new Exception("Password could not be changed. Please contact system administrator.");
        }
    }

	public String getSql() {
		return sql;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	 
 
}
