package net.nan21.dnet.core.web.controller.workflow;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.FormService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.form.FormProperty;
import org.activiti.engine.form.FormType;
import org.activiti.engine.form.StartFormData;
import org.activiti.engine.impl.form.DateFormType;
import org.activiti.engine.impl.form.EnumFormType;
import org.activiti.engine.impl.util.IoUtil;
import org.activiti.engine.repository.ProcessDefinition;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/process-definition/{processDefinitionId}")
public class WorkflowProcessDefinitionController extends
		AbstractWorkflowController {

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/properties")
	@ResponseBody
	public String getProperties(
			@PathVariable("processDefinitionId") String processDefinitionId,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			this.prepareRequest(request, response);

			StartFormData fd = getWorkflowEngine().getFormService()
					.getStartFormData(processDefinitionId);
			List<FormProperty> props = fd.getFormProperties();
			StringBuffer sb = new StringBuffer();
			sb.append("{\"success\":true,\"formKey\": \""
					+ ((fd.getFormKey() != null) ? fd.getFormKey() : "") + "\"");
			sb.append(",\"deploymentId\": \"" + fd.getDeploymentId() + "\"");
			sb.append(",\"processDefinitionId\": \"" + processDefinitionId
					+ "\"");
			sb.append(",\"properties\":[");
			int i = 0;
			for (FormProperty prop : props) {
				if (i > 0) {
					sb.append(",");
				}
				FormType ft = prop.getType();
				sb.append("{");
				sb.append("\"id\":\"" + prop.getId() + "\"");
				sb.append(",\"name\":\""
						+ ((prop.getName() != null) ? prop.getName() : "")
						+ "\"");
				sb.append(",\"type\": {");
				sb.append(" \"name\":\"" + ft.getName() + "\"");
				if (ft instanceof DateFormType) {
					sb.append(" ,\"datePattern\":\""
							+ ft.getInformation("datePattern") + "\"");
				}
				if (ft instanceof EnumFormType) {
					sb.append(" ,\"values\": [");
					Map<String, Object> values = (Map<String, Object>) ft
							.getInformation("values");
					int xx = 0;
					for (Map.Entry<String, Object> v : values.entrySet()) {
						if (xx > 0) {
							sb.append(",");
						}
						sb.append("[\"" + v.getKey() + "\",\"" + v.getValue()
								+ "\"]");
						xx++;
					}
					sb.append("]");
					// + ft.getInformation("datePattern") + "\"");
				}
				sb.append("}");
				sb.append(" ,\"isRequired\":" + prop.isRequired());
				sb.append(" ,\"isReadable\":" + prop.isReadable());
				sb.append(" ,\"isWritable\":" + prop.isWritable());
				sb.append(" ,\"value\":\""
						+ ((prop.getValue() != null) ? prop.getValue() : "")
						+ "\"");
				sb.append("}");
				i++;
			}
			sb.append("]}");

			return sb.toString();
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}

	@RequestMapping(value = "/form")
	@ResponseBody
	public String getForm(
			@PathVariable("processDefinitionId") String processDefinitionId,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			this.prepareRequest(request, response);

			ProcessEngine processEngine = getWorkflowEngine();
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
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}

	/**
	 * Get the process definition diagram as a stream
	 * 
	 * @param processDefinitionId
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/diagram")
	@ResponseBody
	public String getDiagram(
			@PathVariable("processDefinitionId") String processDefinitionId,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			this.prepareRequest(request, response);

			RepositoryService repositoryService = getWorkflowRepositoryService();
			ProcessDefinition processDefinition = repositoryService
					.createProcessDefinitionQuery()
					.processDefinitionId(processDefinitionId).singleResult();

			if (processDefinition.getDiagramResourceName() == null) {
				throw new Exception(
						"No diagram provided for this process definition.");
			}
			InputStream stream = null;

			try {
				stream = repositoryService.getResourceAsStream(
						processDefinition.getDeploymentId(),
						processDefinition.getDiagramResourceName());
				this.sendFile(stream, response.getOutputStream());
			} finally {
				IoUtil.closeSilently(stream);
			}
			return null;
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}

	/**
	 * Get the process definition bpmn xml as a stream
	 * 
	 * @param processDefinitionId
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/xml")
	@ResponseBody
	public String getXml(
			@PathVariable("processDefinitionId") String processDefinitionId,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			this.prepareRequest(request, response);
			RepositoryService repositoryService = getWorkflowRepositoryService();
			ProcessDefinition processDefinition = repositoryService
					.createProcessDefinitionQuery()
					.processDefinitionId(processDefinitionId).singleResult();
			InputStream stream = null;

			try {
				stream = repositoryService.getResourceAsStream(
						processDefinition.getDeploymentId(),
						processDefinition.getResourceName());
				this.sendFile(stream, response.getOutputStream());
			} finally {
				IoUtil.closeSilently(stream);
			}
			return null;
		} catch (Exception e) {
			return this.handleException(e, response);
		} finally {
			this.finishRequest();
		}
	}
}
