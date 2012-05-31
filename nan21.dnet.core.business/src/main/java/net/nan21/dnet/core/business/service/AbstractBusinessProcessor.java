package net.nan21.dnet.core.business.service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.service.IEntityService;

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
}
