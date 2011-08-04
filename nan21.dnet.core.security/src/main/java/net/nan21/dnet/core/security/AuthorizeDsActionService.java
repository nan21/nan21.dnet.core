/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.security;

import net.nan21.dnet.core.security.NotAuthorizedRequestException;
 
import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuthorizeDsActionService  extends JdbcDaoSupport {

     public void authorize(String dsName, String action, boolean defaultIsAllow ) throws Exception {
         
        int i=0;
        try {
            i = this.getJdbcTemplate().queryForInt(this.buildSql(dsName, action, defaultIsAllow));
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            // catch it to handle it below
        }
                
        if ( (defaultIsAllow && i==1)
                || ( !defaultIsAllow && i==0 )) {
            throw new NotAuthorizedRequestException("You are not authorized to execute this action.");
        } 
    }
    
    private String buildSql(String dsName, String action, boolean defaultIsAllow) {
        StringBuffer sb = new StringBuffer();
        SessionUser u = (SessionUser)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        sb.append("select 1 ");        
        sb.append(" from bd_acl_ds acl  where acl.dsname = '"+dsName+"' ");
 
        sb.append("and acl.role_id in (select ur.roles_id from bd_users_roles ur where ur.users_id in ( select u.id from bd_users u where u.code = '"+u.getUsername()+"' ) )");
        int x = (defaultIsAllow )? 0:1;
         
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
