package net.nan21.dnet.core.web.controller.ui;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.IProductInfo;
import net.nan21.dnet.core.api.session.Params;
import net.nan21.dnet.core.api.session.User;
import net.nan21.dnet.core.security.SessionUser;
import net.nan21.dnet.core.web.settings.UiExtjsSettings;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.mvc.AbstractController;

public abstract class AbstractUiExtjsController  extends AbstractController  {

	private final static String COOKIE_NAME_THEME = "dnet-theme";
	private final static String DEFAULT_THEME = "gray";
	private final static String COOKIE_NAME_LANG = "dnet-lang";
	private final static String DEFAULT_LANG = "en";
	
	
	protected IProductInfo productInfo;	 
	protected String jspName;
	protected String deploymentUrl;
	protected String uiUrl;
	protected Map<String, Object> model;
	protected UiExtjsSettings uiExtjsSettings;
	  
	protected void _prepare(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String server = request.getServerName();
		int port = request.getServerPort();
		String contextPath = request.getContextPath();
		String path = request.getServletPath();
 
		String userUsername = "";
		String userDisplayName = "";
		String userClientCode = "";
		String userClientId = "";
		
		try {
			SessionUser su = (SessionUser) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();
			User user = (User)su.getUser();
			Params params = (Params)su.getParams();                          
			userUsername = user.getUsername();
			userDisplayName = user.getDisplayName();
			userClientCode = user.getClientCode();
			userClientId = user.getClientId().toString(); 
        } catch (ClassCastException e) {
            // not authenticated 
        }
		this.deploymentUrl = ((request.isSecure())? "https" : "http" ) + "://" +server +  ((port!=80)?(":"+port):"" ) + contextPath;
		this.uiUrl = deploymentUrl + path;
		
		this.model = new HashMap<String, Object>();
		
		this.model.put("deploymentUrl", this.deploymentUrl);
		this.model.put("uiUrl", this.uiUrl);
		this.model.put("product", this.productInfo);
		
		this.model.put("userUsername", userUsername);
		this.model.put("userDisplayName", userDisplayName);
		this.model.put("userClientCode", userClientCode);
		this.model.put("userClientId", userClientId);
		  
		this.model.put("urlUiExtjs", uiExtjsSettings.getUrlUiExtjs() );
		this.model.put("urlUiExtjsCore", uiExtjsSettings.getUrlUiExtjsCore() );
		this.model.put("urlUiExtjsLibExtjs", uiExtjsSettings.getUrlUiExtjsLibExtjs() );
		
		this.model.put("shortLanguage", this.resolveLang(request, response) );		 
		this.model.put("theme", this.resolveTheme(request, response) );		
	}
	
	
	private String resolveTheme(HttpServletRequest request,
			HttpServletResponse response) {
		Cookie[] cookies = request.getCookies();
		Cookie c = this.getCookie(cookies, COOKIE_NAME_THEME);
		if ( c == null) {
			 c = this.createCookie(COOKIE_NAME_THEME, DEFAULT_THEME, 60*60*24*365);
			 response.addCookie(c); 
		}
		 
		String theme = request.getParameter("theme");		  
		if (theme == null || theme.equals("") ) {						
			theme = c.getValue();
		} else {			 
			c.setMaxAge(0); 			
			c = this.createCookie(COOKIE_NAME_THEME, theme, 60*60*24*365); 
			response.addCookie(c);
		}
		return theme;
	}
	
	private String resolveLang(HttpServletRequest request,
			HttpServletResponse response) {
		Cookie[] cookies = request.getCookies();
		Cookie c = this.getCookie(cookies, COOKIE_NAME_LANG);
		if ( c == null) {
			 c = this.createCookie(COOKIE_NAME_LANG, DEFAULT_LANG, 60*60*24*365);
			 response.addCookie(c); 
		}
		 
		String lang = request.getParameter("lang");		  
		if (lang == null || lang.equals("") ) {						
			lang = c.getValue();
		} else {			 
			c.setMaxAge(0); 			
			c = this.createCookie(COOKIE_NAME_LANG, lang, 60*60*24*365); 
			response.addCookie(c);
		}
		return lang;
	}
	
	
	private Cookie getCookie(Cookie[] cookies, String name) {
		if (cookies != null) {
			for(int i=0; i<cookies.length; i++) {
				Cookie cookie = cookies[i];
				if (name.equals(cookie.getName())) {
					return cookie;
				}					
			}
		}		
		return null;
	}
	
	
	private Cookie createCookie(String name, String value, int age ) {
		Cookie c = new Cookie(name, value);
		c.setMaxAge(age);
		return c;
	}
	 
	
	public IProductInfo getProductInfo() {
		return productInfo;
	}


	public void setProductInfo(IProductInfo productInfo) {
		this.productInfo = productInfo;
	}


	public String getJspName() {
		return jspName;
	}

	public void setJspName(String jspName) {
		this.jspName = jspName;
	}

	
	public UiExtjsSettings getUiExtjsSettings() {
		return uiExtjsSettings;
	}

	public void setUiExtjsSettings(UiExtjsSettings uiExtjsSettings) {
		this.uiExtjsSettings = uiExtjsSettings;
	}
	
	
	
	
}
