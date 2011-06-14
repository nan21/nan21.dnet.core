package net.nan21.dnet.core.web.controller.data;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.domain.session.Session;
import net.nan21.dnet.core.domain.session.User;
import net.nan21.dnet.core.domain.session.UserPreferences;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.context.WebApplicationContext;

@Controller
public class AbstractDataController {

	protected String resourceName;
	protected String dataFormat;
	@Autowired
	protected WebApplicationContext webappContext;

	protected void prepareRequest() {
		String username = "admin";
		String displayName = "Administrator";
		String password = "";
		boolean accountExpired = false;
		boolean accountLocked = false;
		boolean credentialsExpired = false;
		boolean enabled = true;
		String clientCode = "SYS";
		Long clientId = 1L;
		UserPreferences preferences = new UserPreferences();
		String employeeCode = null;
		Long employeeId = null;

		User u = new User(username, displayName, password, accountExpired,
				accountLocked, credentialsExpired, enabled, clientCode,
				clientId, preferences, employeeCode, employeeId);

		Session.user.set(u);
	}

	protected void finishRequest() {

	}

	public String getResourceName() {
		return resourceName;
	}

	public void setResourceName(String resourceName) {
		this.resourceName = resourceName;
	}

	public String getDataFormat() {
		return dataFormat;
	}

	public void setDataFormat(String dataFormat) {
		this.dataFormat = dataFormat;
	}

	public WebApplicationContext getWebappContext() {
		return webappContext;
	}

	public void setWebappContext(WebApplicationContext webappContext) {
		this.webappContext = webappContext;
	}

	protected String handleException(Exception e, HttpServletResponse response)  throws IOException {
		response.setStatus(500);
		response.getOutputStream().print(e.getLocalizedMessage());		 
		return e.getLocalizedMessage();
	}

}
