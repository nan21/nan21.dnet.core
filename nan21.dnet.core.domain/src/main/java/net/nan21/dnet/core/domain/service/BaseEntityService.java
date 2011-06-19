package net.nan21.dnet.core.domain.service;

import net.nan21.dnet.core.api.service.IEntityService;
 
public class BaseEntityService<E> extends AbstractEntityService<E> 
		implements IEntityService<E>{

	private Class<E> entityClass;
	
	public BaseEntityService(Class<E> entityClass) {
		this.entityClass = entityClass;
	}
	
	protected Class<E> getEntityClass() {		
		return this.entityClass;
	}
	
	public static <E> BaseEntityService<E>  createService(Class<E> entityClass) {
		return new BaseEntityService<E>(entityClass);
	}

}