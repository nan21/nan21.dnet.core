package net.nan21.dnet.core.web.controller.workflow;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.FormService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.impl.util.IoUtil;
import org.activiti.engine.repository.ProcessDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Scope(value = "request")
@RequestMapping(value = "/process-definition/{processDefinitionId}")
public class WorkflowProcessDefinitionController extends
		AbstractWorkflowController {

	 
	@RequestMapping(value = "/form")
	@ResponseBody
	public String getForm(
			@PathVariable("processDefinitionId") String processDefinitionId,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		ProcessEngine processEngine = getProcessEngine();
		FormService formService = processEngine.getFormService();

		Object form = formService.getRenderedStartForm(processDefinitionId);
		InputStream is = null;

		try {
			if (form != null && form instanceof String) {
				is = new ByteArrayInputStream(((String) form).getBytes());
			} else if (form != null && form instanceof InputStream) {
				is = (InputStream) form;
			}
			this.sendFile(is, response.getOutputStream());
		} finally {
			IoUtil.closeSilently(is);
		}

		return null;
	}

	@RequestMapping(value = "/diagram")
	@ResponseBody
	public String getDiagram(
			@PathVariable("processDefinitionId") String processDefinitionId,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		RepositoryService repositoryService = getRepositoryService();
		ProcessDefinition processDefinition = repositoryService
				.createProcessDefinitionQuery().processDefinitionId(
						processDefinitionId).singleResult();
		InputStream stream = null;

		try {
			stream = repositoryService.getResourceAsStream(processDefinition
					.getDeploymentId(), processDefinition
					.getDiagramResourceName());
			this.sendFile(stream, response.getOutputStream());
		} finally {
			IoUtil.closeSilently(stream);
		}

		return null;
	}

}
