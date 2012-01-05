package net.nan21.dnet.core.presenter.service;

import java.util.List;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.service.IAsgnService;
import net.nan21.dnet.core.api.service.IAsgnServiceFactory;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IDsServiceFactory;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

/**
 * Service locator utility methods.
 * 
 * @author amathe
 */
public class ServiceLocator {

	@Autowired
	protected ApplicationContext appContext;

	@Autowired
	protected ISystemConfig systemConfig;

	private List<IEntityServiceFactory> entityServiceFactories;

	private List<IDsServiceFactory> dsServiceFactories;

	private List<IAsgnServiceFactory> asgnServiceFactories;

	/**
	 * Find a data-source service given the data-source name.
	 * 
	 * @param <M>
	 * @param <P>
	 * @param dsName
	 * @return
	 * @throws Exception
	 */
	public <M,F,P> IDsService<M,F,P> findDsService(String dsName)
			throws Exception {
		return this.findDsService(dsName, this.getDsServiceFactories());
	}

	/**
	 * Find a data-source service given the data-source model class.
	 * 
	 * @param <M>
	 * @param <P>
	 * @param modelClass
	 * @return
	 * @throws Exception
	 */
	public <M,F,P> IDsService<M,F,P> findDsService(Class<?> modelClass)
			throws Exception {
		return this.findDsService(modelClass.getSimpleName(), this
				.getDsServiceFactories());
	}

	/**
	 * Find a data-source service given the data-source name and a list of
	 * factories.
	 * 
	 * @param <M>
	 * @param <P>
	 * @param dsName
	 * @param factories
	 * @return
	 * @throws Exception
	 */
	public <M,F,P> IDsService<M,F,P> findDsService(String dsName,
			List<IDsServiceFactory> factories) throws Exception {
		IDsService<M,F,P> srv = null;
		for (IDsServiceFactory f : factories) {
			try { 
				srv = f.create(dsName + "Service");
				if (srv != null) {
					// srv.setDsServiceFactories(factories);
					srv.setSystemConfig(this.systemConfig);
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(dsName + "Service not found !");
	}

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
	 * Find an assignment service given the service name.
	 * 
	 * @param <M>
	 * @param <P>
	 * @param asgnName
	 * @return
	 * @throws Exception
	 */
	public <M,F,P> IAsgnService<M,F,P> findAsgnService(String asgnName)
			throws Exception {
		return this.findAsgnService(asgnName, this.getAsgnServiceFactories());
	}

	/**
	 * Find an assignment service given the service name and the list of
	 * factories.
	 * 
	 * @param <M>
	 * @param <P>
	 * @param asgnName
	 * @param factories
	 * @return
	 * @throws Exception
	 */
	public <M,F,P> IAsgnService<M,F,P> findAsgnService(String asgnName,
			List<IAsgnServiceFactory> factories) throws Exception {
		IAsgnService<M,F,P> srv = null;
		for (IAsgnServiceFactory f : factories) {
			try {
				srv = f.create(asgnName);
				if (srv != null) {
					// srv.setDsServiceFactories(serviceFactories);
					srv.setSystemConfig(this.systemConfig);
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(asgnName + "Service not found !");
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

	/**
	 * Get data-source service factories. If it is null attempts to retrieve it
	 * from Spring context by <code>osgiDsServiceFactories</code> alias.
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<IDsServiceFactory> getDsServiceFactories() {
		if (this.dsServiceFactories == null) {
			this.dsServiceFactories = (List<IDsServiceFactory>) this.appContext
					.getBean("osgiDsServiceFactories");
		}
		return this.dsServiceFactories;
	}

	/**
	 * Set data-source service factories.
	 * 
	 * @param dsServiceFactories
	 */
	public void setDsServiceFactories(List<IDsServiceFactory> dsServiceFactories) {
		this.dsServiceFactories = dsServiceFactories;
	}

	/**
	 * Get assignment factories. If it is null attempts to retrieve it from
	 * Spring context by <code>osgiAsgnServiceFactories</code> alias.
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<IAsgnServiceFactory> getAsgnServiceFactories() {
		if (this.asgnServiceFactories == null) {
			this.asgnServiceFactories = (List<IAsgnServiceFactory>) this.appContext
					.getBean("osgiAsgnServiceFactories");
		}
		return asgnServiceFactories;
	}

	/**
	 * Set assignment factories.
	 * 
	 * @param asgnServiceFactories
	 */
	public void setAsgnServiceFactories(
			List<IAsgnServiceFactory> asgnServiceFactories) {
		this.asgnServiceFactories = asgnServiceFactories;
	}

}
