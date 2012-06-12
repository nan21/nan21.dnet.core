package net.nan21.dnet.core.security;

import java.sql.SQLException;

import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.security.core.context.SecurityContextHolder;

import net.nan21.dnet.core.api.security.IAuthorization;

public class AuthorizationForAsgn extends JdbcDaoSupport implements
		IAuthorization {

	private String authActionQuery;

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
					"You are not authorized to execute this action. <BR> Not enogh privileges on resource `"
							+ dsName + "`");
		}
	}

	private String buildSql(String dsName, String action) {

		StringBuffer sb = new StringBuffer(this.authActionQuery);
		int x = 1;
		if (action.equals("find")) {
			sb.append(" and acl.queryAllowed = " + x);
		}
		if (action.equals("update")) {
			sb.append(" and acl.updateAllowed = " + x);
		}
		return sb.toString();
	}

	public String getAuthActionQuery() {
		return authActionQuery;
	}

	public void setAuthActionQuery(String authActionQuery) {
		this.authActionQuery = authActionQuery;
	}

}
