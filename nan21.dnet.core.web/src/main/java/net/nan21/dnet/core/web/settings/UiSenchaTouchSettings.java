/*
 * DNet eBusiness Suite
 * Project: dnet-web-core 
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.web.settings;

/**
 * Sencha-touch based user-interface settings. These properties are populated
 * from the system properties specified in the application configuration file.
 * 
 * @author amathe
 * 
 */
public class UiSenchaTouchSettings {

	/**
	 * Root URL of the modules components
	 */
	private String urlModules;

	/**
	 * Root URL of the core framework
	 */
	private String urlCore;

	/**
	 * Root URL of the sencha-touch library
	 */
	private String urlLib;

	public String getUrlModules() {
		return urlModules;
	}

	public void setUrlModules(String urlModules) {
		this.urlModules = urlModules;
	}

	public String getUrlCore() {
		return urlCore;
	}

	public void setUrlCore(String urlCore) {
		this.urlCore = urlCore;
	}

	public String getUrlLib() {
		return urlLib;
	}

	public void setUrlLib(String urlLib) {
		this.urlLib = urlLib;
	}

}
