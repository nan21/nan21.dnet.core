package net.nan21.dnet.core.presenter;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.presenter.service.ServiceLocator;

public abstract class AbstractPresenterBase extends
		AbstractApplicationContextAware {
	/**
	 * System configuration. May be null, use the getter.
	 */
	private ISystemConfig systemConfig;

	private ServiceLocator serviceLocator;

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

	/**
	 * Lookup an entity service.
	 * 
	 * @param <E>
	 * @param entityClass
	 * @return
	 * @throws Exception
	 */
	public <T> IEntityService<T> findEntityService(Class<T> entityClass)
			throws Exception {
		return this.getServiceLocator().findEntityService(entityClass);
	}
}
