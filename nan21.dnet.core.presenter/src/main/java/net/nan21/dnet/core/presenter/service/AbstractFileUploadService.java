package net.nan21.dnet.core.presenter.service;

import org.activiti.engine.ProcessEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class AbstractFileUploadService {
	@Autowired
	protected ApplicationContext appContext;
	
	
	public ProcessEngine getWorkflowEngine() {		
		return (ProcessEngine)this.getAppContext().getBean("osgiActivitiProcessEngine");		 
    }
	
	public ApplicationContext getAppContext() {
		return appContext;
	}
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}
	
}
