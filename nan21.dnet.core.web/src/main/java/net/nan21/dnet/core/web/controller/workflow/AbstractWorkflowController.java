package net.nan21.dnet.core.web.controller.workflow;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.session.Params;
import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.api.session.User;
import net.nan21.dnet.core.api.session.UserProfile;
import net.nan21.dnet.core.api.wf.IActivitiProcessEngineHolder;
import net.nan21.dnet.core.security.NotAuthorizedRequestException;
import net.nan21.dnet.core.security.SessionUser;

import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.impl.util.json.JSONObject;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.WebApplicationContext;

public class AbstractWorkflowController {

	@Autowired
	private IActivitiProcessEngineHolder processEngineHolder;

	protected ProcessEngine workflowEngine;
	@Autowired
	protected WebApplicationContext webappContext;
	protected final static int FILE_TRANSFER_BUFFER_SIZE = 4 * 1024;

	final static Logger logger = LoggerFactory
			.getLogger(AbstractWorkflowController.class);

	protected void prepareRequest() throws Exception {
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
			throw new Exception("<b>Session expired.</b>"
					+ "<br> Logout from application and login again.");
		}
		Session.user.set(user);
		Session.profile.set(profile);
		Session.params.set(params);
	}

	protected void finishRequest() {
		Session.user.set(null);
		Session.params.set(null);
	}

	public void setProcessEngine(ProcessEngine processEngine) {
		this.workflowEngine = processEngine;
	}

	public ProcessEngine getWorkflowEngine() throws Exception {
		if (this.workflowEngine == null) {
			this.workflowEngine = (ProcessEngine) this.webappContext.getBean(
					IActivitiProcessEngineHolder.class).getProcessEngine();
		}
		return this.workflowEngine;
	}

	public RuntimeService getWorkflowRuntimeService() throws Exception {
		return this.getWorkflowEngine().getRuntimeService();
	}

	public TaskService getWorkflowTaskService() throws Exception {
		return this.getWorkflowEngine().getTaskService();
	}

	public RepositoryService getWorkflowRepositoryService() throws Exception {
		return this.getWorkflowEngine().getRepositoryService();
	}

	public HistoryService getWorkflowHistoryService() throws Exception {
		return this.getWorkflowEngine().getHistoryService();
	}

	public FormService getWorkflowFormService() throws Exception {
		return this.getWorkflowEngine().getFormService();
	}

	protected void init() {
		// getIdentityService().setAuthenticatedUserId(ar.getCurrentUserId());
	}

	public WebApplicationContext getWebappContext() {
		return webappContext;
	}

	public void setWebappContext(WebApplicationContext webappContext) {
		this.webappContext = webappContext;
	}

	@ExceptionHandler(value = Exception.class)
	protected String handleException(Exception e, HttpServletResponse response)
			throws IOException {
		if (e instanceof NotAuthorizedRequestException) {
			return this.handleException((NotAuthorizedRequestException) e,
					response);
		} else {
			// String msg = null;

			Exception exc = e;
			if (e instanceof InvocationTargetException) {
				exc = (Exception) ((InvocationTargetException) e)
						.getTargetException();
			}
			if (exc.getCause() != null) {
				exc = (Exception) exc.getCause();
			}

			exc.printStackTrace();
			response.setStatus(500);
			response.getOutputStream().print(exc.getMessage());

			return null; // e.getLocalizedMessage();
		}

	}

	protected void sendFile(InputStream inputStream, ServletOutputStream stream)
			throws IOException {
		try {
			byte[] buf = new byte[FILE_TRANSFER_BUFFER_SIZE];
			int bytesRead;
			while ((bytesRead = inputStream.read(buf)) != -1) {
				stream.write(buf, 0, bytesRead);
			}
		} finally {
			if (inputStream != null)
				inputStream.close();
		}
		stream.flush();
	}

	protected ObjectMapper createMarshaller() {
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(SerializationConfig.Feature.WRITE_DATES_AS_TIMESTAMPS,
				false);
		mapper
				.configure(SerializationConfig.Feature.FAIL_ON_EMPTY_BEANS,
						false);
		mapper
				.configure(
						DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES,
						false);
		return mapper;
	}

	private JSONObject json = null;

	@SuppressWarnings("unchecked")
	public Map<String, Object> getFormVariables(HttpServletRequest request)
			throws Exception {
		request.getParameterMap().entrySet();
		Map<String, Object> params = new HashMap<String, Object>();
		Iterator<Map.Entry<String, String[]>> i = request.getParameterMap()
				.entrySet().iterator();
		while (i.hasNext()) {
			Map.Entry<String, String[]> e = i.next();

			params.put(e.getKey(), e.getValue()[0]);
		}

		try {
			json = new JSONObject(params);
		} catch (Throwable t) {
			json = new JSONObject();
		}

		Map<String, Object> map = new HashMap<String, Object>();
		Iterator<String> keys = json.keys();
		String key, typeKey, type;
		String[] keyPair;
		Object value;
		while (keys.hasNext()) {
			key = (String) keys.next();
			keyPair = key.split("_");
			if (keyPair.length == 1) {
				typeKey = keyPair[0] + "_type";
				if (json.has(typeKey)) {
					type = json.getString(typeKey);
					if (type.equals("Integer")) {
						value = json.getInt(key);
					} else if (type.equals("Boolean")) {
						value = json.getBoolean(key);
					} else if (type.equals("Date")) {
						value = json.getString(key);
					} else if (type.equals("User")) {
						value = json.getString(key);
					} else if (type.equals("String")) {
						value = json.getString(key);
					} else {
						throw new Exception(
						/* Status.STATUS_BAD_REQUEST, */"Parameter '"
								+ keyPair[0] + "' is of unknown type '" + type
								+ "'");
					}
				} else {
					value = json.get(key);
				}
				map.put(key, value);
			} else if (keyPair.length == 2) {
				if (keyPair[1].equals("required")) {
					if (!json.has(keyPair[0]) || json.get(keyPair[0]) == null) {
						throw new Exception(
						/* Status.STATUS_BAD_REQUEST, */"Parameter '"
								+ keyPair[0] + "' has no value");
					}
				}
			}
		}
		return map;
	}

	public IActivitiProcessEngineHolder getProcessEngineHolder() {
		return processEngineHolder;
	}

	public void setProcessEngineHolder(
			IActivitiProcessEngineHolder processEngineHolder) {
		this.processEngineHolder = processEngineHolder;
	}

}
