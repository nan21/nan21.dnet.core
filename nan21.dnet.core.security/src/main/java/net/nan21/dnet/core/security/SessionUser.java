/*
 * DNet eBusiness Suite
 * Project: dnet-web-core 
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.security;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import net.nan21.dnet.core.api.session.Params;
import net.nan21.dnet.core.api.session.User;

//import org.activiti.engine.impl.identity.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.Assert;

public class SessionUser implements UserDetails {
 
    private static final long serialVersionUID = 1L;
    private Boolean administrator;
    private Set<GrantedAuthority> authorities;

    private User user;
    private Params params;

    public SessionUser(User user, Params params) {
        super();
        this.user = user;
        this.params = params; 
        //Authentication.setAuthenticatedUserId(user.getUsername());
        /*
         * try {
			  identityService.setAuthenticatedUserId("bono");
			  runtimeService.startProcessInstanceByKey("someProcessKey");
			} finally {
			  identityService.setAuthenticatedUserId(null);
			}
			*/
        
    }

    public void addAuthorities(Collection<? extends GrantedAuthority> authoritiesList) {
        if (this.authorities == null) {
            this.authorities = Collections
            .unmodifiableSet(sortAuthorities(authoritiesList)); 
        }        
    }
     
    /**
     * @return the administrator
     */
    public Boolean isAdministrator() {
        return this.administrator;
    } 
     
    /**
     * @param administrator the administrator to set
     */
    public void setAdministrator(Boolean administrator) {
        if (this.administrator == null) {
            this.administrator = administrator;
        }           
    }
 
    /**
     * @return the user
     */
    public User getUser() {
        return this.user;
    }

    /**
     * @return the params
     */
    public Params getParams() {
        return this.params;
    }

    /**
     * @return the defaultAccessAllow
     */
    public boolean isDefaultAccessAllow() {
        return this.params.isDefaultAccessAllow();
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return new String(this.user.getPassword());
    }

    /**
     * @return the username
     */
    public String getUsername() {
        return this.user.getUsername();
    }

    /**
     * @return the authorities
     */
    public Set<GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    /**
     * @return the accountNonExpired
     */
    public boolean isAccountNonExpired() {
        return !this.user.isAccountExpired();
    }

    /**
     * @return the accountNonLocked
     */
    public boolean isAccountNonLocked() {
        return !this.user.isAccountLocked();
    }

    /**
     * @return the credentialsNonExpired
     */
    public boolean isCredentialsNonExpired() {
        return !this.user.isCredentialsExpired();
    }

    /**
     * @return the enabled
     */
    public boolean isEnabled() {
        return this.user.isEnabled();
    }

    private static SortedSet<GrantedAuthority> sortAuthorities(
            Collection<? extends GrantedAuthority> authorities) {
        Assert.notNull(authorities,
                "Cannot pass a null GrantedAuthority collection");
        // Ensure array iteration order is predictable (as per
        // UserDetails.getAuthorities() contract and SEC-717)
        SortedSet<GrantedAuthority> sortedAuthorities = new TreeSet<GrantedAuthority>(
                new AuthorityComparator());

        for (GrantedAuthority grantedAuthority : authorities) {
            Assert.notNull(grantedAuthority,
                    "GrantedAuthority list cannot contain any null elements");
            sortedAuthorities.add(grantedAuthority);
        }

        return sortedAuthorities;
    }

    private static class AuthorityComparator implements
            Comparator<GrantedAuthority>, Serializable {
        private static final long serialVersionUID = 1L;

        public int compare(GrantedAuthority g1, GrantedAuthority g2) {
            // Neither should ever be null as each entry is checked before
            // adding it to the set.
            // If the authority is null, it is a custom authority and should
            // precede others.
            if (g2.getAuthority() == null) {
                return -1;
            }

            if (g1.getAuthority() == null) {
                return 1;
            }

            return g1.getAuthority().compareTo(g2.getAuthority());
        }
    }
}
