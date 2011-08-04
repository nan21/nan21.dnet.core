package net.nan21.dnet.core.business.service;
 
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class EntityServiceFactory implements IEntityServiceFactory{
	@Autowired
	private ApplicationContext appContext;
	
	@Override
	public <E> IEntityService<E> create(String key) {
		IEntityService<E> s = (IEntityService<E>)this.appContext.getBean(key);
		return s; 		 
	}
	
	public <E> IEntityService<E> create(Class<E> type) {
		IEntityService<E> s = (IEntityService<E>)this.appContext.getBean(type);
		return s; 		 
	}
	
	public ApplicationContext getAppContext() {
		return appContext;
	}
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}
	
}