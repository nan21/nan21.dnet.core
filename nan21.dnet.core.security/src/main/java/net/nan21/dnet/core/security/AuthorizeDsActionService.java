/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.security;

import java.sql.SQLException;

import net.nan21.dnet.core.api.session.IAuthorizeDsAction;
import net.nan21.dnet.core.security.NotAuthorizedRequestException;
 
import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuthorizeDsActionService  extends JdbcDaoSupport
		implements IAuthorizeDsAction{

     public void authorize(String dsName, String action ) throws Exception {
    	 SessionUser u = (SessionUser)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
     	if (u.isAdministrator()) {
     		return;
     	}
        int i=0;
        try {
        	
        	i = this.getJdbcTemplate().queryForInt(this.buildSql(dsName, action ),  dsName, u.getUsername());
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            // catch it to handle it below
        } finally {
            try {
                this.getConnection().close();
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
                
        if ( i<1) {
            throw new NotAuthorizedRequestException("You are not authorized to execute this action.");
        } 
    }
    
    private String buildSql(String dsName, String action ) {
    	String baseSql = "select distinct 1 from AD_ACCESS_CONTROL_DS acl where acl.dsname = ? "
    		+" and exists ( "
    		+" select 1 "
    		+"   from AD_ROLES_ACCESSCTRL rac"
    		+"  where rac.accessControls_id = acl.accessControl_id and rac.roles_id in ( "
    		+" 		select ur.roles_id from ad_users_roles ur where ur.users_id in ( select u.id from ad_users u where u.code = ? )"
    		+"	)"
    		+")";
    	
        StringBuffer sb = new StringBuffer(baseSql);
         int x = 1;
        if (action.equals("find")) {
            sb.append(" and acl.queryAllowed = "+x);
        }
        if (action.equals("export")) {
            sb.append(" and acl.exportAllowed = "+x);
        }
        if (action.equals("import")) {
            sb.append(" and acl.importAllowed = "+x);
        }
        if (action.equals("insert")) {
            sb.append(" and acl.insertAllowed = "+x);
        }
        if (action.equals("update")) {
            sb.append(" and acl.updateAllowed = "+x);
        }
        if (action.equals("delete")) {
            sb.append(" and acl.deleteAllowed = "+x);
        }
        return sb.toString();
    }
}
