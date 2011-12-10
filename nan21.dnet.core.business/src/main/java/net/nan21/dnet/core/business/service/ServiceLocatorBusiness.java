package net.nan21.dnet.core.business.service;

import java.util.List;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

/**
 * Service locator utility methods.
 * @author amathe
 */
public class ServiceLocatorBusiness {

	@Autowired
	protected ApplicationContext appContext;
 
	@Autowired
	protected ISystemConfig systemConfig;
	
	
	private List<IEntityServiceFactory> entityServiceFactories;
	
	
	/**
	 * Find an entity service given the entity class.
	 * 
	 * @param <E>
	 * @param entityClass
	 * @return
	 * @throws Exception
	 */
	public <E> IEntityService<E> findEntityService(Class<E> entityClass)
			throws Exception {
		return this.findEntityService(entityClass, this
				.getEntityServiceFactories());
	}

	/**
	 * Find an entity service given the entity class and a list of factories.
	 * 
	 * @param <E>
	 * @param entityClass
	 * @param factories
	 * @return
	 * @throws Exception
	 */
	public <E> IEntityService<E> findEntityService(Class<E> entityClass,
			List<IEntityServiceFactory> factories) throws Exception {
		for (IEntityServiceFactory esf : factories) {
			try {
				IEntityService<E> srv = esf.create(entityClass.getSimpleName()
						+ "Service"); // this.getEntityClass()
				if (srv != null) {
					srv.setSystemConfig(this.systemConfig);
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(entityClass.getSimpleName() + "Service"
				+ " not found ");
	}
	 
	
	/**
	 * Getter for the spring application context.
	 * 
	 * @return
	 */
	public ApplicationContext getAppContext() {
		return appContext;
	}

	/**
	 * Setter for the spring application context.
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
	 * Get entity service factories. If it is null attempts to retrieve it from
	 * Spring context by <code>osgiEntityServiceFactories</code> alias.
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<IEntityServiceFactory> getEntityServiceFactories() {
		if (this.entityServiceFactories == null) {
			this.entityServiceFactories = (List<IEntityServiceFactory>) this.appContext
					.getBean("osgiEntityServiceFactories");
		}
		return this.entityServiceFactories;
	}

	/**
	 * Set entity service factories
	 * 
	 * @param entityServiceFactories
	 */
	public void setEntityServiceFactories(
			List<IEntityServiceFactory> entityServiceFactories) {
		this.entityServiceFactories = entityServiceFactories;
	}
	
	
}
