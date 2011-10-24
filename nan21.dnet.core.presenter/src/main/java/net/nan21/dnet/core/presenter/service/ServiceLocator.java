package net.nan21.dnet.core.presenter.service;

import java.util.List;

import net.nan21.dnet.core.api.SystemConfig;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IDsServiceFactory;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

/**
 * Service locator utility methods.
 * @author amathe
 */
public class ServiceLocator {

	@Autowired
	protected ApplicationContext appContext;
 
	/**
	 * Find a data-source service given the data-source name. 
	 * @param <M>
	 * @param <P>
	 * @param dsName
	 * @return
	 * @throws Exception
	 */
	public <M, P> IDsService<M, P> findDsService(String dsName) throws Exception {
		return this.findDsService(dsName,this.getOsgiDsServiceFactories());
	}
	
	/**
	 * Find a data-source service given the data-source name and a list of factories.
	 * @param <M>
	 * @param <P>
	 * @param dsName
	 * @param factories
	 * @return
	 * @throws Exception
	 */
	public <M, P> IDsService<M, P> findDsService(String dsName,
			List<IDsServiceFactory> factories) throws Exception {
		IDsService<M, P> srv = null;
		for (IDsServiceFactory f : factories) {
			try {
				srv = f.create(dsName + "Service");
				if (srv != null) {
					srv.setDsServiceFactories(factories);
					//srv.setSystemConfig(this.systemConfig);
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(dsName + "Service not found !");
	}

	/**
	 * Find an entity service given the entity class and a list of factories.
	 * @param <E>
	 * @param entityClass
	 * @param factories
	 * @return
	 * @throws Exception
	 */
	public <E> IEntityService<E> findEntityService(Class<E> entityClass, List<IEntityServiceFactory> factories)
			throws Exception {
		for (IEntityServiceFactory esf : factories) {
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

	/**
	 * Get the list with all the data-source service factories published by bundles from the application context.
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<IDsServiceFactory> getOsgiDsServiceFactories() {
		return (List<IDsServiceFactory>)this.appContext.getBean("osgiDsServiceFactories");
	}
	 
	 

	/**
	 * Getter for the spring application context.
	 * @return
	 */
	public ApplicationContext getAppContext() {
		return appContext;
	}

	/**
	 * Setter for the spring application context.
	 * @param appContext
	 */
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}
}
