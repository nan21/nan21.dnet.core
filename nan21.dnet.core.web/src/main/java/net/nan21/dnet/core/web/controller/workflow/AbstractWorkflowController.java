package net.nan21.dnet.core.web.controller.workflow;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.nan21.dnet.core.api.wf.IActivitiProcessEngineHolder;
import net.nan21.dnet.core.web.controller.AbstractDnetController;

import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.impl.util.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class AbstractWorkflowController extends AbstractDnetController {

	// private IActivitiProcessEngineHolder processEngineHolder;

	private ProcessEngine workflowEngine;

	// private JSONObject json = null;

	final static Logger logger = LoggerFactory
			.getLogger(AbstractWorkflowController.class);

	public void setProcessEngine(ProcessEngine processEngine) {
		this.workflowEngine = processEngine;
	}

	public ProcessEngine getWorkflowEngine() throws Exception {
		if (this.workflowEngine == null) {
			this.workflowEngine = (ProcessEngine) this.getApplicationContext()
					.getBean(IActivitiProcessEngineHolder.class)
					.getProcessEngine();
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

	@SuppressWarnings("unchecked")
	public Map<String, Object> getFormVariables(HttpServletRequest request)
			throws Exception {

		Map<String, String> params = collectParams(request, null, null);

		JSONObject json = null;
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

}
