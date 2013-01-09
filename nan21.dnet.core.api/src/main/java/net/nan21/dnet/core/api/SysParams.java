package net.nan21.dnet.core.api;

import java.util.ArrayList;
import java.util.Collection;

import net.nan21.dnet.core.api.descriptor.ISysParamDefinitions;
import net.nan21.dnet.core.api.descriptor.SysParamDefinition;

/**
 * System parameters configurable by users per client.
 * 
 * @author amathe
 * 
 */
public class SysParams implements ISysParamDefinitions {

	public static final String CORE_LOGO_URL_EXTJS = "CORE_LOGO_URL_EXTJS";
	public static final String CORE_LOGO_URL_EXTJS_DEFVAL = "http://dnet.nan21.net/static-demo-resources/client-logo.png";

	public static final String CORE_LOGO_URL_STOUCH = "CORE_LOGO_URL_STOUCH";
	public static final String CORE_LOGO_URL_STOUCH_DEFVAL = "http://dnet.nan21.net/static-demo-resources/client-logo.png";

	public static final String CORE_LOGO_URL_REPORT = "CORE_LOGO_URL_REPORT";
	public static final String CORE_LOGO_URL_REPORT_DEFVAL = "http://dnet.nan21.net/static-demo-resources/client-logo-report.png";

	public static final String CORE_SESSION_CHECK_IP = "CORE_SESSION_CHECK_IP";
	public static final String CORE_SESSION_CHECK_IP_DEFVAL = "false";

	public static final String CORE_SESSION_CHECK_USER_AGENT = "CORE_SESSION_CHECK_USER_AGENT";
	public static final String CORE_SESSION_CHECK_USER_AGENT_DEFVAL = "false";

	public static final String CORE_EXP_HTML_CSS = "CORE_EXP_HTML_CSS";
	public static final String CORE_EXP_HTML_CSS_DEFVAL = "http://localhost:8081/dnet-ebs/extjs.themes/webapp/resources/css/export-html.css";

	public static final String CORE_PRINT_HTML_TPL = "CORE_PRINT_HTML_TPL";
	public static final String CORE_PRINT_HTML_TPL_DEFVAL = null;

	public static final String CORE_DEFAULT_LANGUAGE = "CORE_DEFAULT_LANGUAGE";
	public static final String CORE_DEFAULT_LANGUAGE_DEFVAL = "en";

	public static final String CORE_DEFAULT_THEME_EXTJS = "CORE_DEFAULT_THEME_EXTJS";
	public static final String CORE_DEFAULT_THEME_EXTJS_DEFVAL = "gray";

	public static final String CORE_DEFAULT_THEME_STOUCH = "CORE_DEFAULT_THEME_STOUCH";
	public static final String CORE_DEFAULT_THEME_STOUCH_DEFVAL = "gray";

	private Collection<SysParamDefinition> params;

	@Override
	public Collection<SysParamDefinition> getSysParamDefinitions()
			throws Exception {
		if (this.params == null) {
			this.initParams();
		}
		return params;
	}

	synchronized private void initParams() {
		if (this.params == null) {

			this.params = new ArrayList<SysParamDefinition>();

			params.add(new SysParamDefinition(
					CORE_LOGO_URL_EXTJS,
					"Application logo URL - Extjs",
					"Link to the company logo to be displayed in the Extjs based application header.",
					SysParamDefinition.TYPE_STRING, CORE_LOGO_URL_EXTJS_DEFVAL,
					null));

			params.add(new SysParamDefinition(
					CORE_LOGO_URL_STOUCH,
					"Application logo URL - STouch",
					"Link to the company logo to be displayed in report header.",
					SysParamDefinition.TYPE_STRING,
					CORE_LOGO_URL_STOUCH_DEFVAL, null));

			params.add(new SysParamDefinition(CORE_LOGO_URL_REPORT,
					"Report logo URL",
					"Link to the company logo to be displayed in the reports.",
					SysParamDefinition.TYPE_STRING,
					CORE_LOGO_URL_REPORT_DEFVAL, null));

			params.add(new SysParamDefinition(
					CORE_SESSION_CHECK_IP,
					"Check request IP",
					"Check if the remote client IP of the request is the same as the one used at login time. Possible values: true, false.",
					SysParamDefinition.TYPE_BOOLEAN,
					CORE_SESSION_CHECK_IP_DEFVAL, "true,false"));

			params.add(new SysParamDefinition(
					CORE_SESSION_CHECK_USER_AGENT,
					"Check request user-agent",
					"Check if the remote client user-agent of the request is the same as the one used at login time. Possible values: true, false.",
					SysParamDefinition.TYPE_BOOLEAN,
					CORE_SESSION_CHECK_USER_AGENT_DEFVAL, "true,false"));

			params.add(new SysParamDefinition(CORE_EXP_HTML_CSS,
					"Css file location for HTML export",
					"Css used to style the HTML exports from grid.",
					SysParamDefinition.TYPE_STRING, CORE_EXP_HTML_CSS_DEFVAL,
					null));

			params.add(new SysParamDefinition(
					CORE_PRINT_HTML_TPL,
					"Template file location FreeMarker",
					"Default template used when printing in html format with FreeMarker.",
					SysParamDefinition.TYPE_STRING, CORE_PRINT_HTML_TPL_DEFVAL,
					null));

			params.add(new SysParamDefinition(
					CORE_DEFAULT_LANGUAGE,
					"Default language",
					"Default language to be used if no language preference set by user.",
					SysParamDefinition.TYPE_STRING,
					CORE_DEFAULT_LANGUAGE_DEFVAL, null));

			params.add(new SysParamDefinition(
					CORE_DEFAULT_THEME_EXTJS,
					"Default theme Extjs",
					"Default theme to be used in Extjs based user interface if no theme preference set by user.",
					SysParamDefinition.TYPE_STRING,
					CORE_DEFAULT_THEME_EXTJS_DEFVAL, null));

			params.add(new SysParamDefinition(
					CORE_DEFAULT_THEME_STOUCH,
					"Default theme STouch",
					"Default theme to be used in Sencha Toucha based user interface if no theme preference set by user.",
					SysParamDefinition.TYPE_STRING,
					CORE_DEFAULT_THEME_STOUCH_DEFVAL, null));
		}

	}
}
