package net.nan21.dnet.core.api;

/**
 * System parameters configurable by users per client.
 * 
 * @author amathe
 * 
 */
public class SysParam {

	/**
	 * Link to the company logo to be displayed in the Extjs based application
	 * header.
	 */
	public static final String CORE_LOGO_URL_EXTJS = "CORE_LOGO_URL_EXTJS";

	/**
	 * Link to the company logo to be displayed in report header.
	 */
	public static final String CORE_LOGO_URL_STOUCH = "CORE_LOGO_URL_STOUCH";

	/**
	 * Link to the company logo to be displayed in the reports.
	 */
	public static final String CORE_LOGO_URL_REPORT = "CORE_LOGO_URL_REPORT";

	/**
	 * Check if the remote client IP of the request is the same as the one used
	 * at login time. Possible values: true, false
	 */
	public static final String CORE_SESSION_CHECK_IP = "CORE_SESSION_CHECK_IP";

	/**
	 * Check if the remote client user-agent of the request is the same as the
	 * one used at login time. Possible values: true, false
	 */
	public static final String CORE_SESSION_CHECK_USER_AGENT = "CORE_SESSION_CHECK_USER_AGENT";

	/**
	 * Css used to style the HTML exports from grid
	 */
	public static final String CORE_EXP_HTML_CSS = "CORE_EXP_HTML_CSS";

	/**
	 * Default template used when printing in html format with FreeMarker
	 */
	public static final String CORE_PRINT_HTML_TPL = "CORE_PRINT_HTML_TPL";

	/**
	 * Default language to be used if no language preference set by user.
	 */
	public static final String CORE_DEFAULT_LANG = "en";

	/**
	 * Default theme to be used in Extjs based user interface if no theme
	 * preference set by user.
	 */
	public static final String CORE_DEFAULT_THEME_EXTJS = "gray";

	/**
	 * Default theme to be used in Sencha Toucha based user interface if no
	 * theme preference set by user.
	 */
	public static final String CORE_DEFAULT_THEME_STOUCH = "gray";

}
