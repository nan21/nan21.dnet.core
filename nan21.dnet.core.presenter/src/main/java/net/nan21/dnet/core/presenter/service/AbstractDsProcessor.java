package net.nan21.dnet.core.presenter.service;

import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IEntityService;

public abstract class AbstractDsProcessor {

	@Autowired
	protected ApplicationContext appContext;

	@Autowired
	private ISystemConfig systemConfig;
	
	@Autowired
	private ServiceLocator serviceLocator;
	
	/**
	 * Lookup a data-source service.
	 * @param dsName
	 * @return
	 * @throws Exception
	 */
	public <M,F,P> IDsService<M,F,P> findDsService(String dsName) throws Exception {
		return this.getServiceLocator().findDsService(dsName);
	}

	/**
	 * Lookup an entity service.
	 * @param <E>
	 * @param entityClass
	 * @return
	 * @throws Exception
	 */
	public <E> IEntityService<E> findEntityService(Class<E> entityClass)
			throws Exception {
		return this.getServiceLocator().findEntityService(entityClass);
	}

	/**
	 * Prepare a data-source delegate. Inject all required dependencies marked
	 * with <code>@Autowired</code> for which there is no attempt to auto-load 
	 * on-demand from the spring-context.
	 */
	protected <M,F,P> void prepareDelegate(AbstractDsDelegate delegate) {
		delegate.setAppContext(this.appContext);
		// delegate.setEntityServiceFactories(this.getEntityServiceFactories());
		// delegate.setDsServiceFactories(this.getDsServiceFactories());
		// delegate.setSystemConfig(this.getSystemConfig());
		// delegate.setServiceLocator(this.getServiceLocator());
	}
	
	public ProcessEngine getWorkflowEngine() {
		// if (this.workflowEngine == null ) {
		return (ProcessEngine) this.getAppContext().getBean(
				"osgiActivitiProcessEngine");
		// }
		// return this.workflowEngine ;
	}

	public RuntimeService getWorkflowRuntimeService() {
		return this.getWorkflowEngine().getRuntimeService();
	}

	public TaskService getWorkflowTaskService() {
		return this.getWorkflowEngine().getTaskService();
	}

	public RepositoryService getWorkflowRepositoryService() {
		return this.getWorkflowEngine().getRepositoryService();
	}

	public HistoryService getWorkflowHistoryService() {
		return this.getWorkflowEngine().getHistoryService();
	}

	public FormService getWorkflowFormService() {
		return this.getWorkflowEngine().getFormService();
	}

	

	/**
	 * Get application context.
	 * @return
	 */
	public ApplicationContext getAppContext() {
		return appContext;
	}

	/**
	 * Set application context.
	 * @param appContext
	 */
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

	/**
	 * Get system configuration object. If it is null attempts to retrieve it
	 * from Spring context.
	 * @return
	 */
	public ISystemConfig getSystemConfig() {
		if (this.systemConfig == null) {
			this.systemConfig = this.appContext.getBean(ISystemConfig.class);
		}
		return systemConfig;
	}

	/**
	 * Set system configuration object
	 * @param systemConfig
	 */
	public void setSystemConfig(ISystemConfig systemConfig) {
		this.systemConfig = systemConfig;
	}

	
	/**
	 * Get presenter service locator. If it is null attempts to retrieve it
	 * from Spring context.
	 * @return
	 */
	public ServiceLocator getServiceLocator()  {
		if (this.serviceLocator == null) {
			this.serviceLocator = this.appContext.getBean(ServiceLocator.class);
		}
		return serviceLocator;
	}

	/**
	 * Set presenter service locator.
	 * @param serviceLocator
	 */
	public void setServiceLocator(ServiceLocator serviceLocator) {
		this.serviceLocator = serviceLocator;
	}
	
}
