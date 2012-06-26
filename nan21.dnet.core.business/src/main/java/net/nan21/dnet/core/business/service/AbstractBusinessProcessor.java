package net.nan21.dnet.core.business.service;

import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.wf.IActivitiProcessEngineHolder;

import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class AbstractBusinessProcessor {

	@Autowired
	private ApplicationContext appContext;

	@Autowired
	private ISystemConfig systemConfig;

	@Autowired
	private ServiceLocatorBusiness serviceLocator;

	@PersistenceContext
	@Autowired
	protected EntityManager em;

	private ProcessEngine workflowEngine;

	/**
	 * Lookup an entity service.
	 * 
	 * @param <T>
	 * @param entityClass
	 * @return
	 * @throws Exception
	 */
	public <T> IEntityService<T> findEntityService(Class<T> entityClass)
			throws Exception {
		return this.getServiceLocator().findEntityService(entityClass);
	}

	/**
	 * @return the entity manager
	 */
	public EntityManager getEntityManager() {
		return this.em;
	}

	/**
	 * @param em
	 *            the entity manager to set
	 */
	public void setEntityManager(EntityManager em) {
		this.em = em;
	}

	/**
	 * Get spring application context.
	 * 
	 * @return
	 */
	public ApplicationContext getAppContext() {
		return appContext;
	}

	/**
	 * Set spring application context.
	 * 
	 * @param appContext
	 */
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

	/**
	 * Get system configuration object. If it is null attempts to retrieve it
	 * from Spring context.
	 * 
	 * @return
	 */
	public ISystemConfig getSystemConfig() {
		if (this.systemConfig == null) {
			this.systemConfig = this.appContext.getBean(ISystemConfig.class);
		}
		return systemConfig;
	}

	/**
	 * Set system configuration object.
	 * 
	 * @param systemConfig
	 */
	public void setSystemConfig(ISystemConfig systemConfig) {
		this.systemConfig = systemConfig;
	}

	/**
	 * Get business service locator. If it is null attempts to retrieve it
	 * 
	 * @return
	 */
	public ServiceLocatorBusiness getServiceLocator() {
		if (this.serviceLocator == null) {
			this.serviceLocator = this.appContext
					.getBean(ServiceLocatorBusiness.class);
		}
		return serviceLocator;
	}

	/**
	 * Set business service locator.
	 * 
	 * @param serviceLocator
	 */
	public void setServiceLocator(ServiceLocatorBusiness serviceLocator) {
		this.serviceLocator = serviceLocator;
	}

	public ProcessEngine getWorkflowEngine() throws Exception {
		if (this.workflowEngine == null) {
			this.workflowEngine = (ProcessEngine) this.getAppContext().getBean(
					IActivitiProcessEngineHolder.class).getProcessEngine();
		}
		return this.workflowEngine;
	}

	public RuntimeService getWorkflowRuntimeService() throws Exception {
		return this.getWorkflowEngine().getRuntimeService();
	}

	public TaskService getWorkflowTaskService() throws Exception {
		return this.getWorkflowEngine().getTaskService();
	}

	public RepositoryService getWorkflowRepositoryService() throws Exception {
		return this.getWorkflowEngine().getRepositoryService();
	}

	public HistoryService getWorkflowHistoryService() throws Exception {
		return this.getWorkflowEngine().getHistoryService();
	}

	public FormService getWorkflowFormService() throws Exception {
		return this.getWorkflowEngine().getFormService();
	}

	public void doStartWfProcessInstanceByKey(String processDefinitionKey,
			String businessKey, Map<String, Object> variables) throws Exception {
		this.getWorkflowRuntimeService().startProcessInstanceByKey(
				processDefinitionKey, businessKey, variables);
	}

	public void doStartWfProcessInstanceById(String processDefinitionId,
			String businessKey, Map<String, Object> variables) throws Exception {
		this.getWorkflowRuntimeService().startProcessInstanceById(
				processDefinitionId, businessKey, variables);
	}

	public void doStartWfProcessInstanceByMessage(String messageName,
			String businessKey, Map<String, Object> processVariables)
			throws Exception {
		this.getWorkflowRuntimeService().startProcessInstanceByMessage(
				messageName, businessKey, processVariables);
	}

}
