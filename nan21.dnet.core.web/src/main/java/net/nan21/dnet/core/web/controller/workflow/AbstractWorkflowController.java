package net.nan21.dnet.core.web.controller.workflow;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.web.controller.ui.AbstractUiExtjsController;

import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.impl.util.json.JSONObject;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.WebApplicationContext;

public class AbstractWorkflowController {

	@Autowired
	protected ProcessEngine processEngine;
	@Autowired
	protected WebApplicationContext webappContext;
	protected final static int FILE_TRANSFER_BUFFER_SIZE = 4 * 1024;
	
	final static Logger logger = LoggerFactory.getLogger(AbstractWorkflowController.class);
	
	public ProcessEngine getProcessEngine() {
		return this.processEngine;		 
    }
	
	public void setProcessEngine(ProcessEngine processEngine) {
		this.processEngine = processEngine;
	}

	protected void init() {
		// getIdentityService().setAuthenticatedUserId(ar.getCurrentUserId());
	}
	
	 
    public RuntimeService getRuntimeService() {
    	return this.getProcessEngine().getRuntimeService();
    }
    
    public TaskService getTaskService() {
    	return this.getProcessEngine().getTaskService();
    }
    public IdentityService getIdentityService() {
    	return this.getProcessEngine().getIdentityService();
    } 
    public RepositoryService getRepositoryService() {
    	return this.getProcessEngine().getRepositoryService();
    }
    
    public HistoryService getHistoryService() {
    	return this.getProcessEngine().getHistoryService();
    }
    
    public FormService getFormService() {
    	return this.getProcessEngine().getFormService();
    }

	public WebApplicationContext getWebappContext() {
		return webappContext;
	}

	public void setWebappContext(WebApplicationContext webappContext) {
		this.webappContext = webappContext;
	}
	
	@ExceptionHandler(value=Exception.class) 
    protected String handleException(Exception e, HttpServletResponse response)  throws IOException {
		logger.error("Exception occured during workflow execution: ", e.getStackTrace());
		response.setStatus(500);
		if (e.getCause() != null ) {
			response.getOutputStream().print(e.getCause().getMessage());			
		} else {
			response.getOutputStream().print(e.getMessage());		
		}			 		
		return null; //e.getLocalizedMessage();
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
	
	protected ObjectMapper createMarshaller() {
		ObjectMapper mapper = new ObjectMapper();
        mapper.configure(
                SerializationConfig.Feature.WRITE_DATES_AS_TIMESTAMPS,
                false);
        mapper.configure(
        		SerializationConfig.Feature.FAIL_ON_EMPTY_BEANS,
                false);
        mapper.configure(
                DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES,
                false);
        return mapper;
	}
	
	private JSONObject json = null;
	public Map<String, Object> getFormVariables(HttpServletRequest request) throws Exception {
		request.getParameterMap().entrySet();
		Map<String, Object> params = new HashMap<String, Object>();
		 Iterator<Map.Entry<String, String[]>> i = request.getParameterMap().entrySet().iterator();
         while (i.hasNext()) {
             Map.Entry<String, String[]> e = i.next();
              
             params.put(e.getKey(), e.getValue()[0]);
         }
         
		try {
		      json = new JSONObject(params);
		    } catch (Throwable t) {
		      json = new JSONObject();
		    }
		    
	    Map<String, Object> map = new HashMap<String, Object>();
	    Iterator<String> keys = json.keys();
	    String key, typeKey, type;
	    String[] keyPair;
	    Object value;
	    while (keys.hasNext()) {
	      key = (String) keys.next();
	      keyPair = key.split("_");
	      if (keyPair.length == 1) {
	        typeKey = keyPair[0] + "_type";
	        if (json.has(typeKey)) {
	          type = json.getString(typeKey);
	          if (type.equals("Integer")) {
	            value = json.getInt(key);
	          } else if (type.equals("Boolean")) {
	            value = json.getBoolean(key);
	          } else if (type.equals("Date")) {
	            value = json.getString(key);
	          } else if (type.equals("User")) {
	            value = json.getString(key);
	          } else if (type.equals("String")) {
	            value = json.getString(key);
	          } else {
	            throw new Exception(/*Status.STATUS_BAD_REQUEST,*/ "Parameter '" + keyPair[0] + "' is of unknown type '" + type + "'");
	          }
	        } else {
	          value = json.get(key);
	        }
	        map.put(key, value);
	      } else if (keyPair.length == 2) {
	        if (keyPair[1].equals("required")) {
	          if (!json.has(keyPair[0]) || json.get(keyPair[0]) == null) {
	            throw new Exception(/*Status.STATUS_BAD_REQUEST,*/ "Parameter '" + keyPair[0] + "' has no value");
	          }
	        }
	      }
	    }
	    return map;
	  }
}
