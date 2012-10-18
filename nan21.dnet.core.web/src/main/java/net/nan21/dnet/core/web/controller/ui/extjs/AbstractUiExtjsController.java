package net.nan21.dnet.core.web.controller.ui.extjs;

import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

	// TODO: externalize these configs and propagate them to the client as well
	private final static String COOKIE_NAME_THEME = "dnet-theme";
	private final static String DEFAULT_THEME = "gray";
	private final static String COOKIE_NAME_LANG = "dnet-lang";
	private final static String DEFAULT_LANG = "en";

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

		String userUsername = "";
		String userDisplayName = "";
		String userClientCode = "";
		String userClientId = "";

		String extjsDateFormat = UserPreferences.EXTJS_DATE_FORMAT;
		String extjsTimeFormat = UserPreferences.EXTJS_TIME_FORMAT;
		String extjsDateTimeFormat = UserPreferences.EXTJS_DATETIME_FORMAT;
		String extjsAltFormats = UserPreferences.EXTJS_ALT_FORMATS;

		String decimalSeparator = UserPreferences.DECIMAL_SEPARATOR;
		String thousandSeparator = UserPreferences.THOUSAND_SEPARATOR;
		String userRolesStr = null;
		boolean userSystemClient = false;

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

			userUsername = user.getUsername();
			userDisplayName = user.getDisplayName();
			userClientCode = user.getClientCode();
			userClientId = user.getClientId().toString();
			userSystemClient = params.isSystemClient();

			extjsDateFormat = prefs.getExtjsDateFormat();
			extjsTimeFormat = prefs.getExtjsTimeFormat();
			extjsDateTimeFormat = prefs.getExtjsDateTimeFormat();
			extjsAltFormats = prefs.getExtjsAltFormats();

			decimalSeparator = prefs.getDecimalSeparator();
			thousandSeparator = prefs.getThousandSeparator();

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

		model.put("userUsername", userUsername);
		model.put("userDisplayName", userDisplayName);
		model.put("userClientCode", userClientCode);
		model.put("userClientId", userClientId);
		model.put("userSystemClient", userSystemClient);

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

		model.put("extjsDateFormat", extjsDateFormat);
		model.put("extjsTimeFormat", extjsTimeFormat);
		model.put("extjsDateTimeFormat", extjsDateTimeFormat);
		model.put("extjsAltFormats", extjsAltFormats);
		model.put("decimalSeparator", decimalSeparator);
		model.put("thousandSeparator", thousandSeparator);
		model.put("userRolesStr", userRolesStr);

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
	 */
	private String resolveTheme(HttpServletRequest request,
			HttpServletResponse response) {
		Cookie[] cookies = request.getCookies();
		Cookie c = this.getCookie(cookies, COOKIE_NAME_THEME);
		if (c == null) {
			c = this.createCookie(COOKIE_NAME_THEME, DEFAULT_THEME,
					60 * 60 * 24 * 365);
			response.addCookie(c);
		}

		String theme = request.getParameter("theme");
		if (theme == null || theme.equals("")) {
			theme = c.getValue();
		} else {
			c.setMaxAge(0);
			c = this.createCookie(COOKIE_NAME_THEME, theme, 60 * 60 * 24 * 365);
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
	 */
	private String resolveLang(HttpServletRequest request,
			HttpServletResponse response) {
		Cookie[] cookies = request.getCookies();
		Cookie c = this.getCookie(cookies, COOKIE_NAME_LANG);
		if (c == null) {
			c = this.createCookie(COOKIE_NAME_LANG, DEFAULT_LANG,
					60 * 60 * 24 * 365);
			response.addCookie(c);
		}

		String lang = request.getParameter("lang");
		if (lang == null || lang.equals("")) {
			lang = c.getValue();
		} else {
			c.setMaxAge(0);
			c = this.createCookie(COOKIE_NAME_LANG, lang, 60 * 60 * 24 * 365);
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
