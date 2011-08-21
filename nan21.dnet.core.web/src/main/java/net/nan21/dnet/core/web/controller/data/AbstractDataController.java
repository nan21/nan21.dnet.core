package net.nan21.dnet.core.web.controller.data;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.session.Params;
import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.api.session.User;
import net.nan21.dnet.core.security.SessionUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.context.WebApplicationContext;

@Controller
public class AbstractDataController {
  
	protected String resourceName;
	protected String dataFormat;
	@Autowired
	protected WebApplicationContext webappContext;

	protected final static int FILE_TRANSFER_BUFFER_SIZE = 4 * 1024;
	
	protected void prepareRequest() throws Exception  {
		SessionUser su;		
		User user;
		Params params;
		try {
            su = (SessionUser) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();
            user = (User)su.getUser();
            params = (Params)su.getParams();                          
             
        } catch (ClassCastException e) {
            throw new Exception(
                    "<b>Session expired.</b>"
                            + "<br> Logout from application and login again.");
        }
        Session.user.set(user);
        Session.params.set(params);   
	}

	protected void finishRequest() {
		Session.user.set(null);
        Session.params.set(null); 
	}

	public String getResourceName() {
		return resourceName;
	}

	public void setResourceName(String resourceName) {
		this.resourceName = resourceName;
	}

	public String getDataFormat() {
		return dataFormat;
	}

	public void setDataFormat(String dataFormat) {
		this.dataFormat = dataFormat;
	}

	public WebApplicationContext getWebappContext() {
		return webappContext;
	}

	public void setWebappContext(WebApplicationContext webappContext) {
		this.webappContext = webappContext;
	}

	protected String handleException(Exception e, HttpServletResponse response)  throws IOException {
		response.setStatus(500);
		response.getOutputStream().print(e.getLocalizedMessage());		 
		return ""; //e.getLocalizedMessage();
	}

	protected void sendFile(File file, ServletOutputStream stream) throws IOException {  
        InputStream in = null;
        try {
            in = new BufferedInputStream(new FileInputStream(file));
            byte[] buf = new byte[FILE_TRANSFER_BUFFER_SIZE];
            int bytesRead;
            while ((bytesRead = in.read(buf)) != -1) {
            	stream.write(buf, 0, bytesRead);
            }
        } finally {
            if (in != null)
                in.close();
        }
        stream.flush();
    }
	
	protected void sendFile(InputStream inputStream, ServletOutputStream stream) throws IOException {           
        try {             
            byte[] buf = new byte[FILE_TRANSFER_BUFFER_SIZE];
            int bytesRead;
            while ((bytesRead = inputStream.read(buf)) != -1) {
            	stream.write(buf, 0, bytesRead);
            }
        } finally {
            if (inputStream != null)
            	inputStream.close();
        }
        stream.flush();
    }
	
}
