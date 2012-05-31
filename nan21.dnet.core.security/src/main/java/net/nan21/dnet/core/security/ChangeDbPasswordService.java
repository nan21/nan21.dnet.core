/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.security;

import java.sql.SQLException;

import net.nan21.dnet.core.api.session.IChangePasswordService;

import org.springframework.jdbc.core.support.JdbcDaoSupport;

public class ChangeDbPasswordService extends JdbcDaoSupport implements IChangePasswordService {

    private String sql;
    
    public void changePassword(String userName, String newPassword,
			String oldPassword, Long clientId, String clientCode) throws Exception {
    	
    	int exists = this.getJdbcTemplate()
    		.queryForInt("select count(1) from AD_USR a where a.code = ? and a.password = ? ", userName, oldPassword)
    		 ;
    	if (exists == 0 ) {
    		throw new Exception("Incorrect password!");
    	}
    	if (newPassword == null || newPassword.equals("")) {
			throw new Exception("Password must not be empty!");
		}
		  
    	if (this.sql==null) {
    		throw new Exception("Invalid configuration of change password service. Sql statement not specified in bean definition.");
    	}
        int i;
		try {
			i = this.getJdbcTemplate().update(this.sql, newPassword, userName, clientId);
		 } finally {
            try {
                this.getConnection().close();
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
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
