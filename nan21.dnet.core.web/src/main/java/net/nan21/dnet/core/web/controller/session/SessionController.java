package net.nan21.dnet.core.web.controller.session;

import java.io.IOException;

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
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.WebApplicationContext;

@Controller
@Scope(value = "request")
@RequestMapping(value = "/session")
public class SessionController {

	@Autowired
	protected WebApplicationContext webappContext;

	@Autowired
	private AuthenticationManager authenticationManager;

	@ResponseBody
	@RequestMapping(params = "action=login")
	public String login(
			@RequestParam(value = "user", required = true) String username,
			@RequestParam(value = "pswd", required = true) String password,
			@RequestParam(value = "client", required = true) String clientCode,
			@RequestParam(value = "lang", required = false ) String language,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			DefaultLoginAuthParams.clientCode.set(clientCode);
			DefaultLoginAuthParams.language.set(language);
			Authentication authRequest = new UsernamePasswordAuthenticationToken(
					username, password);
			Authentication authResponse = this.authenticationManager
					.authenticate(authRequest);
			SecurityContextHolder.getContext().setAuthentication(authResponse);

			User u = ((SessionUser) authResponse.getPrincipal()).getUser();
			Params params = ((SessionUser) authResponse.getPrincipal())
					.getParams();
			UserPreferences prefs = u.getPreferences();
			StringBuffer sb = new StringBuffer();

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
	@RequestMapping(params = "action=logout")
	public String logout(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		SecurityContextHolder.getContext().setAuthentication(null);
		request
				.getSession()
				.removeAttribute(
						HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
		return "";
	}

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

	protected String handleException(Exception e, HttpServletResponse response)
			throws IOException {
		response.setStatus(403);
		// response.getOutputStream().print(e.getLocalizedMessage());
		return e.getLocalizedMessage();
	}
}
