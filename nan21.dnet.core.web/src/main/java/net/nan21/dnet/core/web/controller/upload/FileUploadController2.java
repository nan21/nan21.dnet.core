package net.nan21.dnet.core.web.controller.upload;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IFileUploadService;
import net.nan21.dnet.core.api.service.IFileUploadServiceFactory;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class FileUploadController2 extends AbstractFileUploadController {

	protected List<IFileUploadServiceFactory> fileUploadServiceFactories;

	/**
	 * Generic file upload. Expects an uploaded file, a set of context
	 * parameters with names starting with "_p_" and a handler alias to delegate
	 * the uploaded file processing to.
	 * 
	 * @param handler
	 *            spring-bean alias of an
	 *            {@link net.nan21.dnet.core.api.service.IFileUploadService}
	 *            which should process the uploaded file
	 * @param file
	 *            Uploaded file
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/file-upload/{handler}", method = RequestMethod.POST)
	@ResponseBody
	public String fileUpload(@PathVariable("handler") String handler,
			@RequestParam("file") MultipartFile file,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		if (file.isEmpty()) {
			throw new Exception("Upload was not succesful. Try again please.");
		}

		this.prepareRequest(request, response);
		//Map<String, String> contextParams = this.collectParams(request);
		Map<String, Object> result = new HashMap<String, Object>();

		// try to find a delegate to hand over processing

		this.finishRequest();
		result.put("success", true);
		ObjectMapper mapper = getJsonMapper();

		return mapper.writeValueAsString(result);
	}

	/**
	 * Dedicated file upload for data-source CSV imports.
	 * 
	 * @param file
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/ds-csv-import/{dsName}", method = RequestMethod.POST)
	@ResponseBody
	public String dsCsvImport(@PathVariable("dsName") String dsName,
			@RequestParam("file") MultipartFile file,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		if (file.isEmpty()) {
			throw new Exception("Upload was not succesful. Try again please.");
		}

		this.prepareRequest(request, response);

		this.authorizeDsAction(dsName.substring(0, dsName.length() - 2),
				"import");

		// Map<String, String> contextParams = this.collectParams(request);
		Map<String, Object> result = new HashMap<String, Object>();

		IDsService<?, ?, ?> dsService = this.getServiceLocator().findDsService(
				dsName);
		dsService.doImport(file.getInputStream(), file.getOriginalFilename());
		this.finishRequest();
		result.put("success", true);
		ObjectMapper mapper = getJsonMapper();

		return mapper.writeValueAsString(result);
	}

	public List<IFileUploadServiceFactory> getFileUploadServiceFactories() {
		return fileUploadServiceFactories;
	}

	public void setFileUploadServiceFactories(
			List<IFileUploadServiceFactory> fileUploadServiceFactories) {
		this.fileUploadServiceFactories = fileUploadServiceFactories;
	}

	/**
	 * Try to locate a file-upload service by its name (spring-bean alias)
	 * 
	 * @param dsName
	 * @return
	 * @throws Exception
	 */
	protected IFileUploadService getFileUploadService(String name)
			throws Exception {
		IFileUploadService srv = null;
		for (IFileUploadServiceFactory sf : fileUploadServiceFactories) {
			try {
				srv = sf.create(name);
				if (srv != null) {
					srv.setSystemConfig(this.getApplicationContext().getBean(
							ISystemConfig.class));
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(name + "File upload service not found for name "
				+ name + "!");
	}

}
