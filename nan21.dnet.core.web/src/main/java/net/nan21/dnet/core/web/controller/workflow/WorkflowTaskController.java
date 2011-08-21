package net.nan21.dnet.core.web.controller.workflow;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.FormService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.form.FormProperty;
import org.activiti.engine.impl.util.IoUtil;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Scope(value = "request")
@RequestMapping(value = "/task")
public class WorkflowTaskController extends AbstractWorkflowController {

	 
	@RequestMapping(value = "/{taskId}/form")
	@ResponseBody
	public String getForm(@PathVariable("taskId") String taskId,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		ProcessEngine processEngine = getProcessEngine();
		FormService formService = processEngine.getFormService();

		Object form = formService.getRenderedTaskForm(taskId);
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

	@RequestMapping(value = "/{taskId}/properties")
	@ResponseBody
	public String getProperties(@PathVariable("taskId") String taskId,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		ProcessEngine processEngine = getProcessEngine();
		FormService formService = processEngine.getFormService();

		List<FormProperty> taskFormData = formService.getTaskFormData(taskId)
				.getFormProperties();

		return createMarshaller().writeValueAsString(taskFormData);

	}

	
	@RequestMapping(value = "/{taskId}/complete")
	@ResponseBody
	public String doComplete(@PathVariable("taskId") String taskId,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		getTaskService().complete(taskId, getFormVariables(request));
		return "{'success':true}";
	} 
}
