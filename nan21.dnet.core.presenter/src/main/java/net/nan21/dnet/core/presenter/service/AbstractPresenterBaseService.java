package net.nan21.dnet.core.presenter.service;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.wf.IActivitiProcessEngineHolder;

import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;

/**
 * Root abstract class for presenter service hierarchy. It provides support for
 * the sub-classes with the generally needed elements like an
 * applicationContext, system configuration parameters, workflow services etc.
 * 
 * Usually an application developer shouldn't sub-class directly this class but
 * choose one of the more specialized sub-class based on the particular need.
 * 
 * @author amathe
 * 
 */
public abstract class AbstractPresenterBaseService extends
		AbstractApplicationContextAware {

	/**
	 * System configuration. May be null, use the getter.
	 */
	private ISystemConfig systemConfig;

	private ServiceLocator serviceLocator;

	private ProcessEngine workflowEngine;

	/**
	 * Lookup a data-source service.
	 * 
	 * @param dsName
	 * @return
	 * @throws Exception
	 */
	public <M, F, P> IDsService<M, F, P> findDsService(String dsName)
			throws Exception {
		return this.getServiceLocator().findDsService(dsName);
	}

	/**
	 * Lookup an entity service.
	 * 
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
	protected <M, F, P> void prepareDelegate(
			AbstractPresenterBaseService delegate) {
		delegate.setApplicationContext(this.getApplicationContext());
	}

	/**
	 * Get presenter service locator. If it is null attempts to retrieve it from
	 * Spring context.
	 * 
	 * @return
	 */
	public ServiceLocator getServiceLocator() {
		if (this.serviceLocator == null) {
			this.serviceLocator = this.getApplicationContext().getBean(
					ServiceLocator.class);
		}
		return serviceLocator;
	}

	/**
	 * Set presenter service locator.
	 * 
	 * @param serviceLocator
	 */
	public void setServiceLocator(ServiceLocator serviceLocator) {
		this.serviceLocator = serviceLocator;
	}

	/**
	 * Get system configuration object. If it is null attempts to retrieve it
	 * from Spring context.
	 * 
	 * @return
	 */
	public ISystemConfig getSystemConfig() {
		if (this.systemConfig == null) {
			this.systemConfig = this.getApplicationContext().getBean(
					ISystemConfig.class);
		}
		return systemConfig;
	}

	/**
	 * Set system configuration object
	 * 
	 * @param systemConfig
	 */
	public void setSystemConfig(ISystemConfig systemConfig) {
		this.systemConfig = systemConfig;
	}

	public ProcessEngine getWorkflowEngine() throws Exception {
		if (this.workflowEngine == null) {
			this.workflowEngine = (ProcessEngine) this.getApplicationContext()
					.getBean(IActivitiProcessEngineHolder.class)
					.getProcessEngine();
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
}
