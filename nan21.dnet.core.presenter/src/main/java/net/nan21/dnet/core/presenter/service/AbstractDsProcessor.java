package net.nan21.dnet.core.presenter.service;

import java.util.List;

import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import net.nan21.dnet.core.api.SystemConfig;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IDsServiceFactory;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;

public class AbstractDsProcessor<M, P> {

	@Autowired
	protected ApplicationContext appContext;

	protected SystemConfig systemConfig;
	
	protected List<IEntityServiceFactory> entityServiceFactories;
	protected List<IDsServiceFactory> dsServiceFactories;

	// private ProcessEngine workflowEngine;

	public IDsService<M, P> findDsService(String dsName) throws Exception {
		IDsService<M, P> srv = null;

		if (dsServiceFactories == null) {
			dsServiceFactories = (List<IDsServiceFactory>) this.appContext
					.getBean("osgiDsServiceFactories");
		}

		for (IDsServiceFactory f : dsServiceFactories) {
			try {
				srv = f.create(dsName + "Service");
				if (srv != null) {
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(dsName + "Service not found !");
	}

	public <E> IEntityService<E> findEntityService(Class<E> entityClass)
			throws Exception {
		for (IEntityServiceFactory esf : entityServiceFactories) {
			try {
				IEntityService<E> es = esf.create(entityClass.getSimpleName()
						+ "Service"); // this.getEntityClass()
				if (es != null) {
					return es;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(entityClass.getSimpleName() + "Service"
				+ " not found ");
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

	public List<IEntityServiceFactory> getEntityServiceFactories() {
		return entityServiceFactories;
	}

	public void setEntityServiceFactories(
			List<IEntityServiceFactory> entityServiceFactories) {
		this.entityServiceFactories = entityServiceFactories;
	}

	public ApplicationContext getAppContext() {
		return appContext;
	}

	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

	public List<IDsServiceFactory> getDsServiceFactories() {
		return dsServiceFactories;
	}

	public void setDsServiceFactories(List<IDsServiceFactory> dsServiceFactories) {
		this.dsServiceFactories = dsServiceFactories;
	}

	public SystemConfig getSystemConfig() {
		return systemConfig;
	}

	public void setSystemConfig(SystemConfig systemConfig) {
		this.systemConfig = systemConfig;
	}
	
	

}
