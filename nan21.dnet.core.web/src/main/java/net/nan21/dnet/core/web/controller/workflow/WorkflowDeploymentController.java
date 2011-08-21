package net.nan21.dnet.core.web.controller.workflow;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Scope(value = "request")
@RequestMapping(value = "/deployment")
public class WorkflowDeploymentController extends AbstractWorkflowController{

	@RequestMapping(value = "/delete")
	@ResponseBody
	public String getForm(
			@RequestParam(value = "ids") String ids,
			@RequestParam(value = "cascade") Boolean cascade,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String[] idArray = ids.split(",");
		for (String deploymentId: idArray)  {
			this.getRepositoryService().deleteDeployment(deploymentId, cascade);
		}
		 
		return "{'success':true}";
	}
	
}
