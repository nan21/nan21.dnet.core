package net.nan21.dnet.core.domain.service;
 
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class EntityServiceFactory implements IEntityServiceFactory{
	@Autowired
	private ApplicationContext appContext;
	
	@Override
	public IEntityService create(String key) {
		IEntityService s = (IEntityService)this.appContext.getBean(key);
		return s; 		 
	}
	
	public IEntityService create(Class<?> type) {
		IEntityService s = (IEntityService)this.appContext.getBean(type);
		return s; 		 
	}
	
	public ApplicationContext getAppContext() {
		return appContext;
	}
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}
	
}