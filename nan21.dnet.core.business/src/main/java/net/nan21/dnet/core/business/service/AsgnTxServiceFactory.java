package net.nan21.dnet.core.business.service;

import net.nan21.dnet.core.api.service.IAsgnTxService;
import net.nan21.dnet.core.api.service.IAsgnTxServiceFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class AsgnTxServiceFactory implements IAsgnTxServiceFactory{
	@Autowired
	private ApplicationContext appContext;
	
	@Override
	public <E> IAsgnTxService<E> create(String key) {
		IAsgnTxService<E> s = (IAsgnTxService<E>)this.appContext.getBean(key);
		return s; 		 
	}
	
	public <E> IAsgnTxService<E> create(Class<E> type) {
		IAsgnTxService<E> s = (IAsgnTxService<E>)this.appContext.getBean(type);
		return s; 		 
	}
	
	public ApplicationContext getAppContext() {
		return appContext;
	}
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}
	
}