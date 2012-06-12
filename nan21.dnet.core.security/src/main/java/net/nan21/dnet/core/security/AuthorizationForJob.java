package net.nan21.dnet.core.security;

import org.springframework.jdbc.core.support.JdbcDaoSupport;

import net.nan21.dnet.core.api.security.IAuthorization;

public class AuthorizationForJob extends JdbcDaoSupport implements
		IAuthorization {

	@Override
	public void authorize(String resourceName, String action) throws Exception {
		// TODO Auto-generated method stub

	}

}
