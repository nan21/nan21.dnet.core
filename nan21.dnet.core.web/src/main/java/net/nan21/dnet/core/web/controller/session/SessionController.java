package net.nan21.dnet.core.web.controller.session;

import java.io.IOException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.session.IChangePasswordService;
import net.nan21.dnet.core.api.session.Params;
import net.nan21.dnet.core.api.session.User;
import net.nan21.dnet.core.api.session.UserPreferences;
import net.nan21.dnet.core.security.DefaultLoginAuthParams;
import net.nan21.dnet.core.security.SessionUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.ModelAndView;

@Controller
@Scope(value = "request")
@RequestMapping(value = "/session")
public class SessionController {

	@Autowired
	protected WebApplicationContext webappContext;

	@Autowired
	private AuthenticationManager authenticationManager;

	// ************* HTML LOGIN *************

	/**
	 * Show login page
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/login")
	public ModelAndView showLogin() throws Exception {
		return new ModelAndView("login");

	}

	/**
	 * Process login action
	 * 
	 * @param username
	 * @param password
	 * @param clientCode
	 * @param language
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/doLogin", method = RequestMethod.POST)
	public ModelAndView doLogin(
			@RequestParam(value = "user", required = true) String username,
			@RequestParam(value = "pswd", required = true) String password,
			@RequestParam(value = "client", required = true) String clientCode,
			@RequestParam(value = "lang", required = false) String language,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {

			DefaultLoginAuthParams.clientCode.set(clientCode);
			DefaultLoginAuthParams.language.set(language);

			String thePassword = password;
			MessageDigest messageDigest = MessageDigest.getInstance("MD5");
			messageDigest.update(thePassword.getBytes(), 0, thePassword
					.length());
			String hashedPass = new BigInteger(1, messageDigest.digest())
					.toString(16);
			if (hashedPass.length() < 32) {
				hashedPass = "0" + hashedPass;
			}

			Authentication authRequest = new UsernamePasswordAuthenticationToken(
					username, hashedPass);
			Authentication authResponse = this.authenticationManager
					.authenticate(authRequest);
			SecurityContextHolder.getContext().setAuthentication(authResponse);

			this.auditLogin((SessionUser) authResponse.getPrincipal(), request);

			response.sendRedirect("/nan21.dnet.core.web/ui/extjs/");
			return null;
		} catch (Exception e) {
			Map<String, String> model = new HashMap<String, String>();
			model.put("error", "Invalid credentials. Authentication failed.");
			return new ModelAndView("login", model);
		}
	}

	@ResponseBody
	@RequestMapping(params = "action=login")
	public String doLoginExtjs(
			@RequestParam(value = "user", required = true) String username,
			@RequestParam(value = "pswd", required = true) String password,
			@RequestParam(value = "client", required = true) String clientCode,
			@RequestParam(value = "lang", required = false) String language,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			// TODO: copy attributes
			request.getSession().invalidate();

			DefaultLoginAuthParams.clientCode.set(clientCode);
			DefaultLoginAuthParams.language.set(language);
			Authentication authRequest = new UsernamePasswordAuthenticationToken(
					username, password);
			Authentication authResponse = this.authenticationManager
					.authenticate(authRequest);
			SecurityContextHolder.getContext().setAuthentication(authResponse);

			SessionUser su = (SessionUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();

			this.auditLogin(su, request);

			User u = su.getUser();
			Params params = su.getParams();
			UserPreferences prefs = u.getPreferences();
			StringBuffer sb = new StringBuffer();
			String userRolesStr = null;
			sb.append(",\"extjsDateFormat\":\"" + prefs.getExtjsDateFormat()
					+ "\"");
			sb.append(" , \"extjsTimeFormat\": \"" + prefs.getExtjsTimeFormat()
					+ "\"");
			sb.append(" , \"extjsDateTimeFormat\": \""
					+ prefs.getExtjsDateTimeFormat() + "\"");
			sb.append(" , \"extjsAltFormats\": \"" + prefs.getExtjsAltFormats()
					+ "\"");
			sb.append(" , \"decimalSeparator\": \""
					+ prefs.getDecimalSeparator() + "\"");
			sb.append(" , \"thousandSeparator\": \""
					+ prefs.getThousandSeparator() + "\"");

			Set<GrantedAuthority> roles = su.getAuthorities();
			StringBuffer sbroles = new StringBuffer();
			int i = 0;
			for (GrantedAuthority role : roles) {
				if (i > 0) {
					sbroles.append(",");
				}
				sbroles.append("\"" + role.getAuthority() + "\"");
				i++;
			}
			userRolesStr = sbroles.toString();
			sb.append(" , \"roles\": [" + userRolesStr + "]");

			request
					.getSession()
					.setAttribute(
							HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
							SecurityContextHolder.getContext());
			return "{ \"success\": true , \"data\": { \"name\":\""
					+ u.getDisplayName() + "\",\"code\":\"" + u.getUsername()
					+ "\", \"clientId\":\"" + u.getClientId()
					+ "\" , \"systemClient\":" + params.isSystemClient()
					+ sb.toString() + "  }  }";
		} catch (Exception e) {
			return this.handleException(e, response);
		}
	}

	@ResponseBody
	@RequestMapping(value = "/doLogout")
	public String doLogout(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		SecurityContextHolder.getContext().setAuthentication(null);
		request.getSession().invalidate();
		// .removeAttribute(
		// HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
		return "";
	}

	// ************* EXTJS LOGIN *************

	@ResponseBody
	@RequestMapping(params = "action=lock")
	public String lock(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return "";
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, params = "action=unlock")
	public String unlock(
			@RequestParam(value = "pswd", required = true) String pswd,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return "";
	}

	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, params = "action=changePassword")
	public String changePassword(
			@RequestParam(value = "opswd", required = true) String oldPassword,
			@RequestParam(value = "npswd", required = true) String newPassword,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			IChangePasswordService service = this.webappContext
					.getBean(IChangePasswordService.class);
			SecurityContext ctx = (SecurityContext) request
					.getSession()
					.getAttribute(
							HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
			if (ctx == null || ctx.getAuthentication() == null) {
				throw new Exception("Not authenticated");
			}
			User user = ((SessionUser) ctx.getAuthentication().getPrincipal())
					.getUser();
			service.changePassword(user.getUsername(), newPassword,
					oldPassword, user.getClientId(), user.getClientCode());
			return "{success: true}";
		} catch (Exception e) {
			return this.handleException(e, response);
		}
	}

	public WebApplicationContext getWebappContext() {
		return webappContext;
	}

	public void setWebappContext(WebApplicationContext webappContext) {
		this.webappContext = webappContext;
	}

	public AuthenticationManager getAuthenticationManager() {
		return authenticationManager;
	}

	public void setAuthenticationManager(
			AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}

	private void auditLogin(SessionUser su, HttpServletRequest request) {
		su.setClientIp(request.getRemoteAddr());
		//su.setClientHost(request.getRemoteHost());
		su.setLoginDate(new Date());
	}

	protected String handleException(Exception e, HttpServletResponse response)
			throws IOException {
		response.setStatus(403);
		// response.getOutputStream().print(e.getLocalizedMessage());
		return e.getLocalizedMessage();
	}
}
