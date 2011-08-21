package net.nan21.dnet.core.web.controller.workflow;

import java.io.InputStream;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

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

	@RequestMapping(value = "/start")
	@ResponseBody
	public String startInstance(
			@RequestParam(value = "processDefinitionId") String processDefinitionId,
			@RequestParam(value = "processDefinitionKey") String processDefinitionKey,
			@RequestParam(value = "businessKey") String businessKey,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		ProcessInstance processInstance = null;
		Map<String, Object> variables = new HashMap<String, Object>();

		Enumeration<String> it = request.getParameterNames();
		while (it.hasMoreElements()) {
			String k = it.nextElement();
			variables.put(k, request.getParameter(k));
		}

		variables.remove("processDefinitionId");
		variables.remove("processDefinitionKey");
		variables.remove("businessKey");
		if (processDefinitionKey != null && !processDefinitionKey.equals("")) {
			processInstance = getRuntimeService().startProcessInstanceByKey(
					processDefinitionKey, businessKey, variables);
		} else {
			processInstance = getRuntimeService().startProcessInstanceById(
					processDefinitionId, businessKey, variables);
		}

		return "{\"id\": \"" + processInstance.getId()
				+ "\", \"processDefinitionId\": \""
				+ processInstance.getProcessDefinitionId()
				+ "\",\"activityNames\": [],\"ended\": true }";
	}

	@RequestMapping(value = "/{processInstanceId}/diagram")
	@ResponseBody
	public String getDiagram(
			@PathVariable("processInstanceId") String processInstanceId,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		ProcessEngine processEngine = getProcessEngine();
		RepositoryService repositoryService = processEngine
				.getRepositoryService();
		RuntimeService runtimeService = processEngine.getRuntimeService();

		ExecutionEntity pi = (ExecutionEntity) runtimeService
				.createProcessInstanceQuery().processInstanceId(
						processInstanceId).singleResult();

		if (pi == null) {
			throw new Exception("Process instance with id" + processInstanceId
					+ " could not be found");
		}

		ProcessDefinitionEntity pde = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
				.getDeployedProcessDefinition(pi.getProcessDefinitionId());

		if (pde != null && pde.isGraphicalNotationDefined()) {

			InputStream stream = null;

			try {
				stream = ProcessDiagramGenerator.generateDiagram(pde, "png",
						runtimeService.getActiveActivityIds(processInstanceId));
				this.sendFile(stream, response.getOutputStream());
			} finally {
				IoUtil.closeSilently(stream);
			}

		} else {
			throw new Exception("Process instance with id " + processInstanceId
					+ " has no graphic description");
		}
		return null;
	}

}
