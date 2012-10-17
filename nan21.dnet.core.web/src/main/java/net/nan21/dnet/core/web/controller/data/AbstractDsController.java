package net.nan21.dnet.core.web.controller.data;

import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.web.controller.AbstractDnetController;

public class AbstractDsController<M, F, P> extends AbstractDnetController {

	/**
	 * Lookup a data-source service.
	 * 
	 * @param dsName
	 * @return
	 * @throws Exception
	 */
	public IDsService<M, F, P> findDsService(String dsName) throws Exception {
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

}
