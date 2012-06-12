package net.nan21.dnet.core.api.security;

public interface IAuthorization {

	public static final String DS_ACTION_QUERY = "query";
	public static final String DS_ACTION_INSERT = "insert";
	public static final String DS_ACTION_UPDATE = "update";
	public static final String DS_ACTION_DELETE = "delete";
	public static final String DS_ACTION_IMPORT = "import";
	public static final String DS_ACTION_EXPORT = "export";
	public static final String DS_ACTION_SERVICE = "service";

	public static final String ASGN_ACTION_READ = "read";
	public static final String ASGN_ACTION_WRITE = "write";

	public static final String JOB_ACTION_EXECUTE = "execute";

	public void authorize(String resourceName, String action) throws Exception;

}
