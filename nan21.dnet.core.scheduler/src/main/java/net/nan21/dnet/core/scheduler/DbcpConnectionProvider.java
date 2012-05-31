package net.nan21.dnet.core.scheduler;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.quartz.utils.ConnectionProvider;

public class DbcpConnectionProvider implements ConnectionProvider {

	private DataSource datasource;

	public DataSource getDatasource() {
		return datasource;
	}

	public void setDatasource(DataSource datasource) {
		this.datasource = datasource;
	}

	public Connection getConnection() throws SQLException {
		return datasource.getConnection();
	}

	/**
	 * Is a shared data-source, do not close it.
	 */
	public void shutdown() throws SQLException {
		// datasource.close();
	}
}
