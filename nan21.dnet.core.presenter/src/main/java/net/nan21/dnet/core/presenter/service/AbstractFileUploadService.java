package net.nan21.dnet.core.presenter.service;

import net.nan21.dnet.core.api.ISystemConfig;

import org.activiti.engine.ProcessEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class AbstractFileUploadService {
	@Autowired
	protected ApplicationContext appContext;
	
	protected ISystemConfig systemConfig;
	
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

	public ISystemConfig getSystemConfig() {
		return systemConfig;
	}

	public void setSystemConfig(ISystemConfig systemConfig) {
		this.systemConfig = systemConfig;
	}
	
}
