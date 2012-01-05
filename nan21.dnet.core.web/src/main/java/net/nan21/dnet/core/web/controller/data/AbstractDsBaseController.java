package net.nan21.dnet.core.web.controller.data;

import org.springframework.beans.factory.annotation.Autowired;

import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.session.IAuthorizeDsAction;
import net.nan21.dnet.core.presenter.service.ServiceLocator;

public class AbstractDsBaseController<M,F,P>
		extends AbstractDataController  {
	
	protected Class<M> modelClass;
	protected Class<F> filterClass;
	protected Class<P> paramClass;

	protected IAuthorizeDsAction authorizeActionService;
	
	@Autowired
	private ServiceLocator serviceLocator;
	
	
	protected Class<P> getParamClass() {
		return this.paramClass;
	}

	protected Class<M> getModelClass() {
		return this.modelClass;
	}
 
	 
	public Class<F> getFilterClass() {
		return filterClass;
	}

	public void setFilterClass(Class<F> filterClass) {
		this.filterClass = filterClass;
	}

	/**
	 * Lookup a data-source service.
	 * @param dsName
	 * @return
	 * @throws Exception
	 */
	public IDsService<M,F,P> findDsService(String dsName) throws Exception {
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
 
	public IAuthorizeDsAction getAuthorizeActionService() {
		return authorizeActionService;
	}

	public void setAuthorizeActionService(IAuthorizeDsAction authorizeActionService) {
		this.authorizeActionService = authorizeActionService;
	}
	
	
	/**
	 * Get presenter service locator. If it is null attempts to retrieve it
	 * from Spring context.
	 * @return
	 */
	public ServiceLocator getServiceLocator()  {
		if (this.serviceLocator == null) {
			this.serviceLocator = this.getWebappContext().getBean(ServiceLocator.class);
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
