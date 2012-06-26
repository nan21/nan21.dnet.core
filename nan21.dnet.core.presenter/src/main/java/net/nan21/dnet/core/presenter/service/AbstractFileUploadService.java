package net.nan21.dnet.core.presenter.service;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.wf.IActivitiProcessEngineHolder;

import org.activiti.engine.ProcessEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class AbstractFileUploadService {
	@Autowired
	protected ApplicationContext appContext;

	protected ISystemConfig systemConfig;

	public ProcessEngine getWorkflowEngine() throws Exception {
		IActivitiProcessEngineHolder holder = this.getAppContext().getBean(
				IActivitiProcessEngineHolder.class);
		return (ProcessEngine) holder.getProcessEngine();

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
