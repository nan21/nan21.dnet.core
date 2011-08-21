package net.nan21.dnet.core.web.controller.upload;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.action.IFileUploadResult;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IDsServiceFactory;
import net.nan21.dnet.core.api.service.IFileUploadService;
import net.nan21.dnet.core.api.service.IFileUploadServiceFactory;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.util.ClassUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.multipart.MultipartFile;

@Controller
@Scope(value="request")
public class FileUploadController {

	@Autowired
	protected WebApplicationContext webappContext;
	
	protected List<IFileUploadServiceFactory> serviceFactories;

    @RequestMapping(value = "/{dsName}", method = RequestMethod.POST)
    @ResponseBody
    public String handleFormUpload(
    		@PathVariable("dsName") String dsName,
    		@RequestParam("name") String name,
    		@RequestParam("file") MultipartFile file,
    		@RequestParam("p1") String p1,
    		@RequestParam("p2") String p2
    		) throws Exception {

    	this.serviceFactories =
    		(List<IFileUploadServiceFactory>)this.webappContext.getBean("osgiFileUploadServiceFactories");
    	
       IFileUploadResult result = this.getService(dsName).execute(name, file, p1, p2);
       return "{success:true}";
    }
    @ExceptionHandler(value=Exception.class) 
    protected String handleException(Exception e, HttpServletResponse response)  throws IOException {
		response.setStatus(500);
		response.getOutputStream().print(e.getLocalizedMessage());		 
		return null; //e.getLocalizedMessage();
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

	public void setServiceFactories(List<IFileUploadServiceFactory> serviceFactories) {
		this.serviceFactories = serviceFactories;
	}

	protected IFileUploadService  getService(String dsName) throws Exception {
		IFileUploadService srv = null;
		for (IFileUploadServiceFactory f : serviceFactories) {
			try {
				srv = f.create(dsName + "Service");
				if (srv != null) {					 
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(dsName + "File upload service not found for name "+dsName+"!");
	}
    
    
}

