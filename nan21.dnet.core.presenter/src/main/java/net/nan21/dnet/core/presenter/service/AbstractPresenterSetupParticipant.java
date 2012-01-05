package net.nan21.dnet.core.presenter.service;

import org.springframework.beans.factory.annotation.Autowired;

import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.setup.AbstractSetupParticipant;

public abstract class AbstractPresenterSetupParticipant extends
		AbstractSetupParticipant {

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
