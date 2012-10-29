package net.nan21.dnet.core.business.service.asgn;

import net.nan21.dnet.core.api.service.IAsgnTxService;

public class DefaultAsgnTxService<E> extends AbstractAsgnTxService<E> implements
		IAsgnTxService<E> {

	public DefaultAsgnTxService() {
	}

	public DefaultAsgnTxService(Class<E> entityClass) {
		this.setEntityClass(entityClass);
	}

}