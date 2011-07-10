package net.nan21.dnet.core.presenter.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import net.nan21.dnet.core.api.service.IAsgnService;
import net.nan21.dnet.core.api.service.IAsgnServiceFactory;
import net.nan21.dnet.core.api.service.IAsgnTxServiceFactory;

public class AsgnServiceFactory implements IAsgnServiceFactory {

	@Autowired
	private ApplicationContext appContext;
	 
	private List<IAsgnTxServiceFactory> asgnTxServiceFactories;
	 
	@Override
	public IAsgnService create(String key) {
		IAsgnService s = (IAsgnService)this.appContext.getBean(key);
		s.setAsgnTxServiceFactories(asgnTxServiceFactories);
		return s; 		 
	}
	 
	public ApplicationContext getAppContext() {
		return appContext;
	}
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

	public List<IAsgnTxServiceFactory> getAsgnTxServiceFactories() {
		return asgnTxServiceFactories;
	}

	public void setAsgnTxServiceFactories(
			List<IAsgnTxServiceFactory> asgnTxServiceFactories) {
		this.asgnTxServiceFactories = asgnTxServiceFactories;
	}
 
	
}
