package net.nan21.dnet.core.web.controller.ui.extjs;

import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.Constants;
import net.nan21.dnet.core.api.SysParam;
import net.nan21.dnet.core.api.session.Params;
import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.api.session.User;
import net.nan21.dnet.core.api.session.UserPreferences;
import net.nan21.dnet.core.api.session.UserProfile;
import net.nan21.dnet.core.api.ui.extjs.ExtensionFile;
import net.nan21.dnet.core.api.ui.extjs.IExtensionContentProvider;
import net.nan21.dnet.core.api.ui.extjs.IExtensionProvider;
import net.nan21.dnet.core.api.ui.extjs.IExtensions;
import net.nan21.dnet.core.security.SessionUser;
import net.nan21.dnet.core.web.controller.AbstractDnetController;
import net.nan21.dnet.core.web.settings.UiExtjsSettings;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

public abstract class AbstractUiExtjsController extends AbstractDnetController {

	private String constantsJsFragment;

	/**
	 * List of extension file providers.
	 */
	protected List<IExtensionProvider> extensionProviders;

	/**
	 * List of js content providers.
	 */
	protected List<IExtensionContentProvider> extensionContentProviders;

	/**
	 * JSP page name which renders the html
	 */
	protected String jspName;

	/**
	 * Various settings to be propagated to client.
	 */
	protected UiExtjsSettings uiExtjsSettings;

	final static Logger logger = LoggerFactory
			.getLogger(AbstractUiExtjsController.class);

	protected void _prepare(Map<String, Object> model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		if (logger.isDebugEnabled()) {
			logger.debug("Handling request for ui.extjs: ",
					request.getPathInfo());
		}

		String server = request.getServerName();
		int port = request.getServerPort();
		String contextPath = request.getContextPath();
		String path = request.getServletPath();

		String userRolesStr = null;

		try {
			SessionUser su = (SessionUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
			User user = (User) su.getUser();
			Params params = (Params) su.getParams();
			UserProfile profile = new UserProfile(su.isAdministrator(),
					su.getRoles());
			UserPreferences prefs = user.getPreferences();

			Session.user.set(user);
			Session.profile.set(profile);
			Session.params.set(params);

			model.put("constantsJsFragment", this.getConstantsJsFragment());

			model.put("userUsername", user.getUsername());
			model.put("userDisplayName", user.getDisplayName());
			model.put("userClientCode", user.getClientCode());
			model.put("userClientId", user.getClientId().toString());
			model.put("userSystemClient", params.isSystemClient());

			model.put("extjsDateFormat", prefs.getExtjsDateFormat());
			model.put("extjsTimeFormat", prefs.getExtjsTimeFormat());
			model.put("extjsDateTimeFormat", prefs.getExtjsDateTimeFormat());
			model.put("extjsAltFormats", prefs.getExtjsAltFormats());

			model.put("decimalSeparator", prefs.getDecimalSeparator());
			model.put("thousandSeparator", prefs.getThousandSeparator());

			Set<GrantedAuthority> roles = su.getAuthorities();
			StringBuffer sb = new StringBuffer();
			int i = 0;
			for (GrantedAuthority role : roles) {
				if (i > 0) {
					sb.append(",");
				}
				sb.append("\"" + role.getAuthority() + "\"");
				i++;
			}
			userRolesStr = sb.toString();

		} catch (ClassCastException e) {
			// not authenticated
		}
		String deploymentUrl = ((request.isSecure()) ? "https" : "http")
				+ "://" + server + ((port != 80) ? (":" + port) : "")
				+ contextPath;
		String uiUrl = deploymentUrl + path;

		model.put("deploymentUrl", deploymentUrl);
		model.put("uiUrl", uiUrl);
		model.put("product", this.getProductInfo());

		// extjs library and themes
		model.put("urlUiExtjsLib", getUiExtjsSettings().getUrlLib());
		model.put("urlUiExtjsThemes", getUiExtjsSettings().getUrlThemes());

		// DNet extjs components in core and modules
		model.put("urlUiExtjsCore", getUiExtjsSettings().getUrlCore());
		model.put("urlUiExtjsModules", getUiExtjsSettings().getUrlModules());
		model.put("urlUiExtjsModuleSubpath", getUiExtjsSettings()
				.getModuleSupath());

		// translations for core and modules
		model.put("urlUiExtjsCoreI18n", getUiExtjsSettings().getUrlCoreI18n());
		model.put("urlUiExtjsModulesI18n", getUiExtjsSettings()
				.getUrlModulesI18n());

		model.put("shortLanguage", this.resolveLang(request, response));
		model.put("theme", this.resolveTheme(request, response));
		model.put("sysCfg_workingMode", this.getSystemConfig().getWorkingMode());

		model.put("userRolesStr", userRolesStr);

	}

	private void addConstant(StringBuffer sb, String name, String value) {
		this.addConstant(sb, name, value, false);
	}

	private void addConstant(StringBuffer sb, String name, String value,
			boolean isLast) {
		sb.append(name + ":\"" + value + "\"");
		if (!isLast) {
			sb.append(",\n");
		}
	}

	private synchronized String getConstantsJsFragment() {

		if (this.constantsJsFragment == null) {

			StringBuffer sb = new StringBuffer("Constants={");

			addConstant(sb, "DATA_FORMAT_CSV", Constants.DATA_FORMAT_CSV);
			addConstant(sb, "DATA_FORMAT_HTML", Constants.DATA_FORMAT_HTML);
			addConstant(sb, "DATA_FORMAT_JSON", Constants.DATA_FORMAT_JSON);
			addConstant(sb, "DATA_FORMAT_XML", Constants.DATA_FORMAT_XML);
			addConstant(sb, "DATA_FORMAT_PDF", Constants.DATA_FORMAT_PDF);

			addConstant(sb, "REQUEST_PARAM_THEME",
					Constants.REQUEST_PARAM_THEME);
			addConstant(sb, "REQUEST_PARAM_LANG", Constants.REQUEST_PARAM_LANG);

			addConstant(sb, "REQUEST_PARAM_ACTION",
					Constants.REQUEST_PARAM_ACTION);
			addConstant(sb, "REQUEST_PARAM_DATA", Constants.REQUEST_PARAM_DATA);
			addConstant(sb, "REQUEST_PARAM_FILTER",
					Constants.REQUEST_PARAM_FILTER);
			addConstant(sb, "REQUEST_PARAM_ADVANCED_FILTER",
					Constants.REQUEST_PARAM_ADVANCED_FILTER);

			addConstant(sb, "REQUEST_PARAM_PARAMS",
					Constants.REQUEST_PARAM_PARAMS);
			addConstant(sb, "REQUEST_PARAM_SORT", Constants.REQUEST_PARAM_SORT);
			addConstant(sb, "REQUEST_PARAM_SENSE",
					Constants.REQUEST_PARAM_SENSE);
			addConstant(sb, "REQUEST_PARAM_START",
					Constants.REQUEST_PARAM_START);
			addConstant(sb, "REQUEST_PARAM_SIZE", Constants.REQUEST_PARAM_SIZE);
			addConstant(sb, "REQUEST_PARAM_ORDERBY",
					Constants.REQUEST_PARAM_ORDERBY);

			addConstant(sb, "REQUEST_PARAM_EXPORT_TITLE",
					Constants.REQUEST_PARAM_EXPORT_TITLE);
			addConstant(sb, "REQUEST_PARAM_EXPORT_LAYOUT",
					Constants.REQUEST_PARAM_EXPORT_LAYOUT);
			addConstant(sb, "REQUEST_PARAM_EXPORT_COL_NAMES",
					Constants.REQUEST_PARAM_EXPORT_COL_NAMES);
			addConstant(sb, "REQUEST_PARAM_EXPORT_COL_TITLES",
					Constants.REQUEST_PARAM_EXPORT_COL_TITLES);
			addConstant(sb, "REQUEST_PARAM_EXPORT_COL_WIDTHS",
					Constants.REQUEST_PARAM_EXPORT_COL_WIDTHS);
			addConstant(sb, "REQUEST_PARAM_SERVICE_NAME_PARAM",
					Constants.REQUEST_PARAM_SERVICE_NAME_PARAM);
			addConstant(sb, "REQUEST_PARAM_EXPORT_FILTER_NAMES",
					Constants.REQUEST_PARAM_EXPORT_FILTER_NAMES);
			addConstant(sb, "REQUEST_PARAM_EXPORT_FILTER_TITLES",
					Constants.REQUEST_PARAM_EXPORT_FILTER_TITLES);

			addConstant(sb, "EXTJS_DATE_FORMAT", Constants.EXTJS_DATE_FORMAT);
			addConstant(sb, "EXTJS_TIME_FORMAT", Constants.EXTJS_TIME_FORMAT);
			addConstant(sb, "EXTJS_DATETIME_FORMAT",
					Constants.EXTJS_DATETIME_FORMAT);
			addConstant(sb, "EXTJS_DATETIMESEC_FORMAT",
					Constants.EXTJS_DATETIMESEC_FORMAT);
			addConstant(sb, "EXTJS_MONTH_FORMAT", Constants.EXTJS_MONTH_FORMAT);
			addConstant(sb, "EXTJS_MODEL_DATE_FORMAT",
					Constants.EXTJS_MODEL_DATE_FORMAT);
			addConstant(sb, "EXTJS_ALT_FORMATS", Constants.EXTJS_ALT_FORMATS);

			addConstant(sb, "DECIMAL_SEPARATOR", Constants.DECIMAL_SEPARATOR);
			addConstant(sb, "THOUSAND_SEPARATOR", Constants.THOUSAND_SEPARATOR);

			addConstant(sb, "DS_INFO", Constants.DS_INFO);
			addConstant(sb, "DS_QUERY", Constants.DS_QUERY);
			addConstant(sb, "DS_INSERT", Constants.DS_INSERT);
			addConstant(sb, "DS_UPDATE", Constants.DS_UPDATE);
			addConstant(sb, "DS_DELETE", Constants.DS_DELETE);
			addConstant(sb, "DS_SAVE", Constants.DS_SAVE);
			addConstant(sb, "DS_IMPORT", Constants.DS_IMPORT);
			addConstant(sb, "DS_EXPORT", Constants.DS_EXPORT);
			addConstant(sb, "DS_PRINT", Constants.DS_PRINT);
			addConstant(sb, "DS_RPC", Constants.DS_RPC, true);

			sb.append("}");

			this.constantsJsFragment = sb.toString();

		}

		return this.constantsJsFragment;
	}

	/**
	 * Get files to be included provided by extensions for the given target.
	 * Target can be a frame's FQN or one of the {@link IExtensions} constants
	 * value.
	 * 
	 * @param targetName
	 * @param baseUrl
	 * @return
	 * @throws Exception
	 */
	protected String getExtensionFiles(String targetName, String baseUrl)
			throws Exception {
		StringBuffer sb = new StringBuffer();
		for (IExtensionProvider provider : this.extensionProviders) {

			List<ExtensionFile> files = provider.getFiles(targetName);

			for (ExtensionFile file : files) {

				String location = null;

				if (file.isRelativePath()) {
					location = baseUrl + "/" + file.getLocation();
				} else {
					location = file.getLocation();
				}

				if (file.isCss()) {
					sb.append("<link rel=\"stylesheet\" type=\"text/css\" href=\""
							+ location + "\" />\n");
				} else if (file.isJs()) {
					sb.append("<script type=\"text/javascript\" src=\""
							+ location + "\"></script>\n");
				} else {
					throw new Exception("Extension provider file `"
							+ file.getLocation()
							+ "` should be of type .js or .css");
				}
			}
		}
		return sb.toString();
	}

	/**
	 * Get content provided by extensions for the given target. Target can be a
	 * frame's FQN or one of the {@link IExtensions} constants value.
	 * 
	 * @param targetName
	 * @return
	 * @throws Exception
	 */
	protected String getExtensionContent(String targetName) throws Exception {
		StringBuffer sb = new StringBuffer(
				"/* BEGIN EXTENSION CONTENT PROVIDER */");
		for (IExtensionContentProvider provider : this.extensionContentProviders) {
			sb.append(provider.getContent(targetName));
		}
		sb.append("/* END EXTENSION CONTENT PROVIDER */");
		return sb.toString();
	}

	/**
	 * Resolve the user's current theme from the cookie.
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	private String resolveTheme(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Cookie[] cookies = request.getCookies();
		Cookie c = this.getCookie(cookies, Constants.COOKIE_NAME_THEME);
		if (c == null) {
			String defaultValue = this.getSystemConfig().getSysParamValue(
					SysParam.CORE_DEFAULT_THEME_EXTJS);
			if (defaultValue == null || defaultValue.equals("")) {
				defaultValue = Constants.DEFAULT_THEME_EXTJS;
			}
			c = this.createCookie(Constants.COOKIE_NAME_THEME, defaultValue,
					60 * 60 * 24 * 365);
			response.addCookie(c);
		}

		String theme = request.getParameter(Constants.REQUEST_PARAM_THEME);
		if (theme == null || theme.equals("")) {
			theme = c.getValue();
		} else {
			c.setMaxAge(0);
			c = this.createCookie(Constants.COOKIE_NAME_THEME, theme,
					60 * 60 * 24 * 365);
			response.addCookie(c);
		}
		return theme;
	}

	/**
	 * Resolve the user's current language from the cookie.
	 * 
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	private String resolveLang(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Cookie[] cookies = request.getCookies();
		Cookie c = this.getCookie(cookies, Constants.COOKIE_NAME_LANG);
		if (c == null) {
			String defaultValue = this.getSystemConfig().getSysParamValue(
					SysParam.CORE_DEFAULT_LANGUAGE);
			if (defaultValue == null || defaultValue.equals("")) {
				defaultValue = Constants.DEFAULT_LANGUAGE;
			}
			c = this.createCookie(Constants.COOKIE_NAME_LANG, defaultValue,
					60 * 60 * 24 * 365);
			response.addCookie(c);
		}

		String lang = request.getParameter(Constants.REQUEST_PARAM_LANG);
		if (lang == null || lang.equals("")) {
			lang = c.getValue();
		} else {
			c.setMaxAge(0);
			c = this.createCookie(Constants.COOKIE_NAME_LANG, lang,
					60 * 60 * 24 * 365);
			response.addCookie(c);
		}
		return lang;
	}

	private Cookie getCookie(Cookie[] cookies, String name) {
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				Cookie cookie = cookies[i];
				if (name.equals(cookie.getName())) {
					return cookie;
				}
			}
		}
		return null;
	}

	private Cookie createCookie(String name, String value, int age) {
		Cookie c = new Cookie(name, value);
		c.setMaxAge(age);
		return c;
	}

	/**
	 * Get Extjs user interface specific a settings object. If it is null
	 * attempts to retrieve it from Spring context.
	 * 
	 * @return
	 */
	public UiExtjsSettings getUiExtjsSettings() {
		if (this.uiExtjsSettings == null) {
			this.uiExtjsSettings = this.getApplicationContext().getBean(
					UiExtjsSettings.class);
		}
		return uiExtjsSettings;
	}

	public void setUiExtjsSettings(UiExtjsSettings uiExtjsSettings) {
		this.uiExtjsSettings = uiExtjsSettings;
	}

	public String getJspName() {
		return jspName;
	}

	public void setJspName(String jspName) {
		this.jspName = jspName;
	}

	public List<IExtensionProvider> getExtensionProviders() {
		return extensionProviders;
	}

	public void setExtensionProviders(
			List<IExtensionProvider> extensionProviders) {
		this.extensionProviders = extensionProviders;
	}

	public List<IExtensionContentProvider> getExtensionContentProviders() {
		return extensionContentProviders;
	}

	public void setExtensionContentProviders(
			List<IExtensionContentProvider> extensionContentProviders) {
		this.extensionContentProviders = extensionContentProviders;
	}

}
