package net.nan21.dnet.core.presenter.service;

import net.nan21.dnet.core.api.SystemConfig;

import org.activiti.engine.ProcessEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class AbstractFileUploadService {
	@Autowired
	protected ApplicationContext appContext;
	
	protected SystemConfig systemConfig;
	
	public ProcessEngine getWorkflowEngine() {		
		return (ProcessEngine)this.getAppContext().getBean("osgiActivitiProcessEngine");		 
    }
	
	public ApplicationContext getAppContext() {
		return appContext;
	}
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}
	
	public ServiceLocator getServiceLocator() {
		return this.appContext.getBean(ServiceLocator.class);
	}

	public SystemConfig getSystemConfig() {
		return systemConfig;
	}

	public void setSystemConfig(SystemConfig systemConfig) {
		this.systemConfig = systemConfig;
	}
	
}
