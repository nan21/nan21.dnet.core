package net.nan21.dnet.core.web.controller.upload;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.action.IFileUploadResult;
import net.nan21.dnet.core.api.model.IUploadedFileDescriptor;
import net.nan21.dnet.core.api.service.IFileUploadService;
import net.nan21.dnet.core.api.service.IFileUploadServiceFactory;
import net.nan21.dnet.core.api.session.Params;
import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.api.session.User;
import net.nan21.dnet.core.presenter.model.UploadedFileDescriptor;
import net.nan21.dnet.core.security.SessionUser;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.multipart.MultipartFile;

@Controller
@Scope(value = "request")
public class FileUploadController {

	@Autowired
	protected WebApplicationContext webappContext;

	protected List<IFileUploadServiceFactory> serviceFactories;

	@RequestMapping(value = "/{dsName}", method = RequestMethod.POST)
	@ResponseBody
	public String handleFormUpload(
			@PathVariable("dsName") String dsName,
			@RequestParam("newFileName") String newFileName,
			@RequestParam("file") MultipartFile file,
			@RequestParam(value = "p0", required = false, defaultValue = "") String p0,
			@RequestParam(value = "p1", required = false, defaultValue = "") String p1,
			@RequestParam(value = "p2", required = false, defaultValue = "") String p2,
			@RequestParam(value = "p3", required = false, defaultValue = "") String p3,
			@RequestParam(value = "p4", required = false, defaultValue = "") String p4,
			@RequestParam(value = "p5", required = false, defaultValue = "") String p5,
			@RequestParam(value = "p6", required = false, defaultValue = "") String p6,
			@RequestParam(value = "p7", required = false, defaultValue = "") String p7,
			@RequestParam(value = "p8", required = false, defaultValue = "") String p8,
			@RequestParam(value = "p9", required = false, defaultValue = "") String p9)
			throws Exception {

		if (file.isEmpty()) {
			throw new Exception("Upload was not succesful. Try again please.");
		}

		SessionUser su;
		User user;
		Params params;
		try {
			su = (SessionUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
			user = (User) su.getUser();
			params = (Params) su.getParams();

		} catch (ClassCastException e) {
			throw new Exception("<b>Session expired.</b>"
					+ "<br> Logout from application and login again.");
		}
		Session.user.set(user);
		Session.params.set(params);
		this.serviceFactories = (List<IFileUploadServiceFactory>) this.webappContext
				.getBean("osgiFileUploadServiceFactories");

		Map<String, String> uploadParams = new HashMap<String, String>();

		uploadParams.put("p0", p0);
		uploadParams.put("p1", p1);
		uploadParams.put("p2", p2);
		uploadParams.put("p3", p3);
		uploadParams.put("p4", p4);
		uploadParams.put("p5", p5);
		uploadParams.put("p6", p6);
		uploadParams.put("p7", p7);
		uploadParams.put("p8", p8);
		uploadParams.put("p9", p9);

		IUploadedFileDescriptor fd = new UploadedFileDescriptor();
		fd.setNewName(newFileName);
		fd.setContentType(file.getContentType());
		fd.setOriginalName(file.getOriginalFilename());
		fd.setSize(file.getSize());

		IFileUploadResult result = this.getService(dsName).execute(fd,
				file.getInputStream(), uploadParams);

		return "{success:true}";
	}

	@ExceptionHandler(value = Exception.class)
	@ResponseBody
	protected String handleException(Exception e, HttpServletResponse response)
			throws IOException {

		response.setStatus(500);
		return this.buildErrorMessage(e.getMessage());
	}

	private String buildErrorMessage(String msg) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return "{ \"success\":false, \"msg\":"
					+ mapper.writeValueAsString(msg) + "}";
		} catch (Exception e) {
			e.printStackTrace();
			return "{ \"success\":false, \"msg\":\"There was an error while trying to serialize the business logic exception. Check the application logs for more details. \"}";

		}

	}

	public WebApplicationContext getWebappContext() {
		return webappContext;
	}

	public void setWebappContext(WebApplicationContext webappContext) {
		this.webappContext = webappContext;
	}

	public List<IFileUploadServiceFactory> getServiceFactories() {
		return serviceFactories;
	}

	public void setServiceFactories(
			List<IFileUploadServiceFactory> serviceFactories) {
		this.serviceFactories = serviceFactories;
	}

	protected IFileUploadService getService(String dsName) throws Exception {
		IFileUploadService srv = null;
		for (IFileUploadServiceFactory f : serviceFactories) {
			try {
				srv = f.create(dsName + "Service");
				if (srv != null) {
					srv.setSystemConfig(this.webappContext
							.getBean(ISystemConfig.class));
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(dsName + "File upload service not found for name "
				+ dsName + "!");
	}

}
