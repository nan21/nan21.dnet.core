package net.nan21.dnet.core.security;

import java.sql.SQLException;

import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.security.core.context.SecurityContextHolder;

import net.nan21.dnet.core.api.security.IAuthorization;

public class AuthorizationForDs extends JdbcDaoSupport implements
		IAuthorization {

	private String authActionQuery;
	private String authServiceMethodQuery;

	public void authorize(String dsName, String action) throws Exception {
		SessionUser u = (SessionUser) SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal();
		if (u.isAdministrator()) {
			return;
		}
		int i = 0;
		try {

			i = this.getJdbcTemplate().queryForInt(
					this.buildSql(dsName, action), dsName, u.getUsername());
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

		if (i < 1) {
			throw new NotAuthorizedRequestException(
					"You are not authorized to execute `" + action
							+ "`. <BR> Not enough privileges on resource `"
							+ dsName + "`");
		}
	}

	private String buildSql(String dsName, String action) {
		// String baseSql = null;
		StringBuffer sb = null;
		int x = 1;
		if (action.equals("find")) {
			sb = new StringBuffer(this.authActionQuery);
			sb.append(" and acl.queryAllowed = " + x);
		} else if (action.equals("export")) {
			sb = new StringBuffer(this.authActionQuery);
			sb.append(" and acl.exportAllowed = " + x);
		} else if (action.equals("import")) {
			sb = new StringBuffer(this.authActionQuery);
			sb.append(" and acl.importAllowed = " + x);
		} else if (action.equals("insert")) {
			sb = new StringBuffer(this.authActionQuery);
			sb.append(" and acl.insertAllowed = " + x);
		} else if (action.equals("update")) {
			sb = new StringBuffer(this.authActionQuery);
			sb.append(" and acl.updateAllowed = " + x);
		} else if (action.equals("delete")) {
			sb = new StringBuffer(this.authActionQuery);
			sb.append(" and acl.deleteAllowed = " + x);
		} else {
			sb = new StringBuffer(this.authServiceMethodQuery);
			sb.append(" and acl.serviceMethod = '" + action + "'");
		}
		return sb.toString();
	}

	public String getAuthActionQuery() {
		return authActionQuery;
	}

	public void setAuthActionQuery(String authActionQuery) {
		this.authActionQuery = authActionQuery;
	}

	public String getAuthServiceMethodQuery() {
		return authServiceMethodQuery;
	}

	public void setAuthServiceMethodQuery(String authServiceMethodQuery) {
		this.authServiceMethodQuery = authServiceMethodQuery;
	}

}
