package net.nan21.dnet.core.api;


/**
 * Global system configuration properties, values injected from properties file.
 * @author amathe
 *
 */
public class SystemConfig {

	/**
	 * Disable the use of fetch groups. 
	 * Temporary parameter as workaround for bug
	 * https://bugs.eclipse.org/bugs/show_bug.cgi?id=337115
	 * When using Oracle database should set to true, possibly with other databases.
	 */
	private boolean disableFetchGroups;
	
	/**
	 * Specify working mode as development or production.
	 */
	private String workingMode;
	
	public final static String WORKING_MODE_DEV = "dev";
	public final static String WORKING_MODE_PROD = "prod";

	public boolean isDisableFetchGroups() {
		return disableFetchGroups;
	}

	public void setDisableFetchGroups(boolean disableFetchGroups) {
		this.disableFetchGroups = disableFetchGroups;
	}

	public String getWorkingMode() {
		return workingMode;
	}

	public void setWorkingMode(String workingMode) {
		this.workingMode = workingMode;
	}
	
	
	
}
