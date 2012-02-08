/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.security;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import net.nan21.dnet.core.api.session.Params;
import net.nan21.dnet.core.api.session.User;
import net.nan21.dnet.core.api.session.UserPreferences;
 
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.jdbc.JdbcDaoImpl;

public class DbUserService extends JdbcDaoImpl {

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException, DataAccessException {

        try {
            List<UserDetails> users = loadUsersByUsername(username);

            if (users.size() == 0) {
                this.logger.debug("Query returned no results for user '" + username
                        + "'");
                throw new UsernameNotFoundException(this.messages.getMessage(
                        "JdbcDaoImpl.notFound", new Object[] { username },
                        "Username {0} not found"), username);
            }

            UserDetails user = users.get(0); // contains no GrantedAuthority[]

            Set<GrantedAuthority> dbAuthsSet = new HashSet<GrantedAuthority>();

            if (this.getEnableAuthorities()) {
                dbAuthsSet.addAll(loadUserAuthorities(user.getUsername()));
            }

            if (this.getEnableGroups()) {
                dbAuthsSet.addAll(loadGroupAuthorities(user.getUsername()));
            }

            List<GrantedAuthority> dbAuths = new ArrayList<GrantedAuthority>(
                    dbAuthsSet);

            addCustomAuthorities(user.getUsername(), dbAuths);

            if (dbAuths.size() == 0) {
                this.logger
                        .debug("User '"
                                + username
                                + "' has no authorities and will be treated as 'not found'");

                throw new UsernameNotFoundException(this.messages.getMessage("x",
                        new Object[] { username },
                        "User {0} has no GrantedAuthority"), username);
            }        
            ((SessionUser)user).addAuthorities(dbAuths) ;
             
            return user;
        } finally  {
            try {
                this.getConnection().close();
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            // this.releaseConnection(this.getConnection().);
        }
    }

    /**
     * Executes the SQL <tt>usersByUsernameQuery</tt> and returns a list of
     * UserDetails objects. There should normally only be one matching user.
     */
    protected List<UserDetails> loadUsersByUsername(String username) {
        try {
            return getJdbcTemplate().query(
                    this.getUsersByUsernameQuery(),
                    new String[] { username,
                            (String) DefaultLoginAuthParams.clientCode.get() },
                    new RowMapper<UserDetails>() {
                        public UserDetails mapRow(ResultSet rs, int rowNum)
                                throws SQLException {
                            String code = rs.getString(1);
                            String name = rs.getString(2);
                            String password = rs.getString(3);
                            boolean enabled = rs.getBoolean(4);

                            boolean accountExpired = rs.getBoolean(5);
                            boolean credentialsExpired = rs.getBoolean(6);
                            boolean accountLocked = rs.getBoolean(7);
                            Long clientId = rs.getLong(8);
                            String clientCode = rs.getString(9);

                            String defaultAccessAllow = rs.getString(10);
                            String defaultImportPath = rs.getString(11);
                            String defaultExportPath = rs.getString(12);
                            String tempPath = rs.getString(13);
                            String adminRole = rs.getString(14); 
                            boolean systemClient = rs.getBoolean(15);
                             
                            String employeeCode = rs.getString(16);
                            Long employeeId = rs.getLong(17);
                             
                            String extjsDateFormat = rs.getString( 18 );
                            String extjsTimeFormat = rs.getString( 19 );
                            String extjsDateTimeFormat = rs.getString( 20 );
                            String extjsAltFormats = rs.getString( 21 );
                            String javaDateFormat = rs.getString( 22 );
                            String javaTimeFormat = rs.getString( 23 );
                            String javaDateTimeFormat = rs.getString( 24 );
                             
                            
                            String decimalSeparator = rs.getString( 25 );
                            String thousandSeparator = rs.getString( 26 );
                            
                            
                            String asgnName = rs.getString(27);
                            Long asgnId = rs.getLong(28);
                            
                            
                            // build the objects
                            UserPreferences preferences = new UserPreferences();
                            
                            preferences.setExtjsDateFormat(extjsDateFormat);
                            preferences.setExtjsTimeFormat(extjsTimeFormat);
                            preferences.setExtjsDateTimeFormat(extjsDateTimeFormat);
                            preferences.setExtjsAltFormats(extjsAltFormats);
                            preferences.setJavaDateFormat(javaDateFormat);
                            preferences.setJavaTimeFormat(javaTimeFormat);
                            preferences.setJavaDateTimeFormat(javaDateTimeFormat);
                             
                            preferences.setDecimalSeparator(decimalSeparator);
                            preferences.setThousandSeparator(thousandSeparator);
                            
                            User user = new User(code, name, password,
                                    accountExpired, accountLocked,
                                    credentialsExpired, enabled, clientCode,
                                    clientId, preferences, employeeCode , employeeId
                                    , asgnName , asgnId);
                            Params params = new Params();

                            if (defaultAccessAllow != null
                                    && defaultAccessAllow.equals("allow")) {
                                params.setDefaultAccessAllow(true);
                            }
                            params.setDefaultImportPath(defaultImportPath);
                            params.setDefaultExportPath(defaultExportPath);
                            params.setTempPath(tempPath);
                            params.setAdminRole(adminRole);   
                            params.setSystemClient(systemClient);
                            
                            // pack
                            SessionUser su = new SessionUser(user, params );
                            return su;
                        }
                    });
        } finally {
            try {
                this.getConnection().close();
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
    }

    @Override
    protected List<GrantedAuthority> loadUserAuthorities(String username) {
        try {
            return getJdbcTemplate().query(
                    this.getAuthoritiesByUsernameQuery(),
                    new String[] { username,
                            (String) DefaultLoginAuthParams.clientCode.get() },
                    new RowMapper<GrantedAuthority>() {
                        public GrantedAuthority mapRow(ResultSet rs, int rowNum)
                                throws SQLException {
                            String roleName = getRolePrefix() + rs.getString(2);
                            GrantedAuthorityImpl authority = new GrantedAuthorityImpl(
                                    roleName);

                            return authority;
                        }
                    });
        } finally {
            try {
                this.getConnection().close();
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
    }

}
