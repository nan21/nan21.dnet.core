package net.nan21.dnet.core.web.controller;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.security.IAuthorizationFactory;
import net.nan21.dnet.core.api.session.Params;
import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.api.session.User;
import net.nan21.dnet.core.api.session.UserProfile;
import net.nan21.dnet.core.presenter.service.ServiceLocator;
import net.nan21.dnet.core.security.NotAuthorizedRequestException;
import net.nan21.dnet.core.security.SessionUser;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

public abstract class AbstractDnetController implements ApplicationContextAware {

	private ApplicationContext applicationContext;

	/**
	 * System configuration. May be null, use the getter.
	 */
	private ISystemConfig systemConfig;

	/**
	 * Presenter service locator. May be null, use the getter.
	 */
	private ServiceLocator serviceLocator;

	/**
	 * Authorization factory. May be null, use the getter.
	 */
	private IAuthorizationFactory authorizationFactory;

	final static Logger logger = LoggerFactory
			.getLogger(AbstractDnetController.class);

	/**
	 * Default transfer buffer size.
	 */
	protected final static int FILE_TRANSFER_BUFFER_SIZE = 4 * 1024;

	protected void prepareRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		SessionUser su;
		User user;
		Params params;
		UserProfile profile;

		try {
			su = (SessionUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
			user = (User) su.getUser();
			params = (Params) su.getParams();
			profile = new UserProfile(su.isAdministrator(), su.getRoles());

		} catch (ClassCastException e) {
			if (logger.isDebugEnabled()) {
				logger.debug("Not authenticated request denied.");
			}
			throw new Exception("<b>Session expired.</b>"
					+ "<br> Logout from application and login again.");
		}

		Session.user.set(user);
		Session.profile.set(profile);
		Session.params.set(params);

		String checkIp = this.getSystemConfig().getSysParamValue(
				"SESSION_CHECK_IP");
		if (checkIp != null && checkIp.equals("true")) {
			if (logger.isDebugEnabled()) {
				logger.debug("SESSION_CHECK_IP enabled, checking IP against login IP...");
			}
			String ip = request.getRemoteAddr();
			if (!su.getClientIp().equals(ip)) {
				logger.debug("Request comes from different IP as expected. Expected: "
						+ su.getClientIp() + ", real " + ip);
				throw new Exception(
						"Security settings do not allow to process request. Check log file for details.");
			}
		}

		String checkAgent = this.getSystemConfig().getSysParamValue(
				"SESSION_CHECK_USER_AGENT");
		if (checkAgent != null && checkAgent.equals("true")) {
			if (logger.isDebugEnabled()) {
				logger.debug("SESSION_CHECK_USER_AGENT enabled, checking user-agent agianst login user-agent...");
			}
			String agent = request.getHeader("User-Agent");
			if (!su.getUserAgent().equals(agent)) {
				logger.debug("Request comes from different user-agent as expected. Expected: "
						+ su.getUserAgent() + ", real " + agent);
				throw new Exception(
						"Security settings do not allow to process request. Check log file for details.");
			}
		}
	}

	protected void finishRequest() {
		Session.user.set(null);
		Session.params.set(null);
	}

	@ExceptionHandler(value = NotAuthorizedRequestException.class)
	protected String handleException(NotAuthorizedRequestException e,
			HttpServletResponse response) throws IOException {
		response.setStatus(403);
		if (e.getCause() != null) {
			response.getOutputStream().print(e.getCause().getMessage());
		} else {
			response.getOutputStream().print(e.getMessage());
		}
		return null;
	}

	@ExceptionHandler(value = Exception.class)
	@ResponseBody
	protected String handleException(Exception e, HttpServletResponse response)
			throws IOException {

		if (e instanceof NotAuthorizedRequestException) {
			return this.handleException((NotAuthorizedRequestException) e,
					response);
		} else if (e instanceof InvocationTargetException) {
			Exception exc = (Exception) ((InvocationTargetException) e)
					.getTargetException();

			if (exc.getCause() != null) {
				exc = (Exception) exc.getCause();
			}

			exc.printStackTrace();
			response.setStatus(500);
			response.getOutputStream().print(exc.getMessage());
			return null;
		}

		response.setStatus(HttpStatus.EXPECTATION_FAILED.value());
		return this.buildErrorMessage(e.getMessage());
	}

	protected ObjectMapper getJsonMapper() {
		return new ObjectMapper();
	}

	private String buildErrorMessage(String msg) {
		ObjectMapper mapper = getJsonMapper();
		try {
			return "{ \"success\":false, \"msg\":"
					+ mapper.writeValueAsString(msg) + "}";
		} catch (Exception e) {
			e.printStackTrace();
			return "{ \"success\": false, \"msg\": \"There was an error while trying to serialize the business logic exception. Check the application logs for more details. \"}";
		}
	}

	protected void sendFile(File file, ServletOutputStream outputStream)
			throws IOException {
		this.sendFile(file, outputStream, FILE_TRANSFER_BUFFER_SIZE);
	}

	protected void sendFile(File file, ServletOutputStream outputStream,
			int bufferSize) throws IOException {
		InputStream in = null;
		try {
			in = new BufferedInputStream(new FileInputStream(file));
			byte[] buf = new byte[bufferSize];
			int bytesRead;
			while ((bytesRead = in.read(buf)) != -1) {
				outputStream.write(buf, 0, bytesRead);
			}
		} finally {
			if (in != null)
				in.close();
		}
		outputStream.flush();
	}

	protected void sendFile(InputStream inputStream,
			ServletOutputStream outputStream) throws IOException {
		this.sendFile(inputStream, outputStream, FILE_TRANSFER_BUFFER_SIZE);
	}

	protected void sendFile(InputStream inputStream,
			ServletOutputStream outputStream, int bufferSize)
			throws IOException {
		try {
			byte[] buf = new byte[bufferSize];
			int bytesRead;
			while ((bytesRead = inputStream.read(buf)) != -1) {
				outputStream.write(buf, 0, bytesRead);
			}
		} finally {
			if (inputStream != null)
				inputStream.close();
		}
		outputStream.flush();
	}

	/* ================= GETTERS - SETTERS ================== */

	public ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	public void setApplicationContext(ApplicationContext applicationContext) {
		this.applicationContext = applicationContext;
	}

	/**
	 * Get system configuration object. If it is null attempts to retrieve it
	 * from Spring context.
	 * 
	 * @return
	 */
	public ISystemConfig getSystemConfig() {
		if (this.systemConfig == null) {
			this.systemConfig = this.getApplicationContext().getBean(
					ISystemConfig.class);
		}
		return systemConfig;
	}

	/**
	 * Set system configuration object
	 * 
	 * @param systemConfig
	 */
	public void setSystemConfig(ISystemConfig systemConfig) {
		this.systemConfig = systemConfig;
	}

	/**
	 * Get presenter service locator. If it is null attempts to retrieve it from
	 * Spring context.
	 * 
	 * @return
	 */
	public ServiceLocator getServiceLocator() {
		if (this.serviceLocator == null) {
			this.serviceLocator = this.getApplicationContext().getBean(
					ServiceLocator.class);
		}
		return serviceLocator;
	}

	/**
	 * Set presenter service locator.
	 * 
	 * @param serviceLocator
	 */
	public void setServiceLocator(ServiceLocator serviceLocator) {
		this.serviceLocator = serviceLocator;
	}

	/**
	 * Get authorization factory. If it is null attempts to retrieve it from
	 * Spring context.
	 * 
	 * @return
	 * @throws Exception
	 */
	public IAuthorizationFactory getAuthorizationFactory() {
		if (this.authorizationFactory == null) {
			this.authorizationFactory = this.getApplicationContext().getBean(
					IAuthorizationFactory.class);
		}
		return authorizationFactory;
	}

	/**
	 * Set authorization factory.
	 * 
	 * @param authorizationFactory
	 */
	public void setAuthorizationFactory(
			IAuthorizationFactory authorizationFactory) {
		this.authorizationFactory = authorizationFactory;
	}

	/**
	 * Authorize an assignment action.
	 * 
	 * @param asgnName
	 * @param action
	 * @throws Exception
	 */
	protected void authorizeAsgnAction(String asgnName, String action)
			throws Exception {
		this.getAuthorizationFactory().getAsgnAuthorizationProvider()
				.authorize(asgnName, action);
	}

	/**
	 * Authorize a DS action.
	 * 
	 * @param asgnName
	 * @param action
	 * @throws Exception
	 */
	protected void authorizeDsAction(String dsName, String action)
			throws Exception {
		this.getAuthorizationFactory().getDsAuthorizationProvider()
				.authorize(dsName, action);
	}

}
