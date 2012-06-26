package net.nan21.dnet.core.web.controller.workflow;

import java.io.InputStream;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.impl.RepositoryServiceImpl;
import org.activiti.engine.impl.bpmn.diagram.ProcessDiagramGenerator;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.util.IoUtil;
import org.activiti.engine.runtime.ProcessInstance;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Scope(value = "request")
@RequestMapping(value = "/process-instance")
public class WorkflowProcessInstanceController extends
		AbstractWorkflowController {

	/**
	 * Start a new instance of the specified process definition
	 * 
	 * @param processDefinitionId
	 * @param processDefinitionKey
	 * @param businessKey
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/start")
	@ResponseBody
	public String startInstance(
			@RequestParam(required = false, value = "processDefinitionId") String processDefinitionId,
			@RequestParam(required = false, value = "processDefinitionKey") String processDefinitionKey,
			@RequestParam(required = false, value = "businessKey") String businessKey,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {
			this.prepareRequest();

			ProcessInstance processInstance = null;
			Map<String, Object> variables = new HashMap<String, Object>();

			Enumeration<String> it = request.getParameterNames();
			while (it.hasMoreElements()) {
				String k = it.nextElement();
				variables.put(k, request.getParameter(k));
			}

			if (businessKey == null || businessKey.equals("")) {
				businessKey = UUID.randomUUID().toString().toUpperCase();
			}
			variables.remove("processDefinitionId");
			variables.remove("processDefinitionKey");
			variables.remove("businessKey");
			if (processDefinitionKey != null
					&& !processDefinitionKey.equals("")) {
				processInstance = getWorkflowRuntimeService()
						.startProcessInstanceByKey(processDefinitionKey,
								businessKey, variables);
			} else {
				processInstance = getWorkflowRuntimeService().startProcessInstanceById(
						processDefinitionId, businessKey, variables);
			}

			return "{\"success\":true, \"id\": \"" + processInstance.getId()
					+ "\", \"processDefinitionId\": \""
					+ processInstance.getProcessDefinitionId()
					+ "\",\"activityNames\": [],\"ended\": true }";
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}

	/**
	 * Get the diagram of the process definition the specified process instance
	 * belongs to.
	 * 
	 * @param processInstanceId
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/{processInstanceId}/diagram")
	@ResponseBody
	public String getDiagram(
			@PathVariable("processInstanceId") String processInstanceId,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {
			this.prepareRequest();

			ProcessEngine processEngine = getWorkflowEngine();
			RepositoryService repositoryService = processEngine
					.getRepositoryService();
			RuntimeService runtimeService = processEngine.getRuntimeService();

			ExecutionEntity pi = (ExecutionEntity) runtimeService
					.createProcessInstanceQuery().processInstanceId(
							processInstanceId).singleResult();

			if (pi == null) {
				throw new Exception("Process instance with id"
						+ processInstanceId + " could not be found");
			}

			ProcessDefinitionEntity pde = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
					.getDeployedProcessDefinition(pi.getProcessDefinitionId());

			if (pde != null && pde.isGraphicalNotationDefined()) {

				InputStream stream = null;

				try {
					stream = ProcessDiagramGenerator.generateDiagram(pde,
							"png", runtimeService
									.getActiveActivityIds(processInstanceId));
					this.sendFile(stream, response.getOutputStream());
				} finally {
					IoUtil.closeSilently(stream);
				}

			} else {
				throw new Exception("Process instance with id "
						+ processInstanceId + " has no graphic description");
			}
			return null;
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}

}
