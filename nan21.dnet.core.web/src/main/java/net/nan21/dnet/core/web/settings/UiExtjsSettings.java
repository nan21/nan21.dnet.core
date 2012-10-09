/*
 * DNet eBusiness Suite
 * Project: dnet-web-core 
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.web.settings;

/**
 * Extjs based user-interface settings. These properties are populated from the
 * system properties specified in the application configuration file.
 * 
 * @author amathe
 * 
 */
public class UiExtjsSettings {

	/**
	 * Root URL of the modules components
	 */
	private String urlModules;

	/**
	 * Root URL of the core framework
	 */
	private String urlCore;

	/**
	 * Root URL of the Extjs library
	 */
	private String urlLib;

	/**
	 * Root URL of the themes for Extjs
	 */
	private String urlThemes;

	/**
	 * Root URL of the modules translations
	 */
	private String urlModulesI18n;

	/**
	 * Root URL of the core translations
	 */
	private String urlCoreI18n;

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
 
	public String getUrlThemes() {
		return urlThemes;
	}

	public void setUrlThemes(String urlThemes) {
		this.urlThemes = urlThemes;
	}

	public String getUrlModulesI18n() {
		return urlModulesI18n;
	}

	public void setUrlModulesI18n(String urlModulesI18n) {
		this.urlModulesI18n = urlModulesI18n;
	}

	public String getUrlCoreI18n() {
		return urlCoreI18n;
	}

	public void setUrlCoreI18n(String urlCoreI18n) {
		this.urlCoreI18n = urlCoreI18n;
	}

}
