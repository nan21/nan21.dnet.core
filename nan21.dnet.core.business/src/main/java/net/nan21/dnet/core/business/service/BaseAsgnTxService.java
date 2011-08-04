package net.nan21.dnet.core.business.service;

import net.nan21.dnet.core.api.service.IAsgnTxService;

public class BaseAsgnTxService<E> extends AbstractAsgnTxService<E> 
		implements IAsgnTxService<E> {
	
	private Class<E> entityClass;
	
	public BaseAsgnTxService() {
	}
	
	public BaseAsgnTxService(Class<E> entityClass) {
		this.entityClass = entityClass;
	}
	
	public Class<E> getEntityClass() {		
		return this.entityClass;
	}

	public void setEntityClass(Class<E> entityClass) {
		this.entityClass = entityClass;
	}
	
}