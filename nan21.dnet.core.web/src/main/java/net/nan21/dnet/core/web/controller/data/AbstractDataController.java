package net.nan21.dnet.core.web.controller.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.WebApplicationContext;

public class AbstractDataController {

	protected String resourceName;
	protected String dataFormat;
	protected WebApplicationContext webappContext;
	
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

	@Autowired
	public void setWebappContext(WebApplicationContext webappContext) {
		this.webappContext = webappContext;
	}
	
}
