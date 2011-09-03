package net.nan21.dnet.core.presenter.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IDsServiceFactory;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;

public class DsServiceFactory implements IDsServiceFactory {

	@Autowired
	private ApplicationContext appContext;

	private List<IEntityServiceFactory> entityServiceFactories;

	private String name;

	@SuppressWarnings("unchecked")
	@Override
	public <M, P> IDsService<M, P> create(String key) {
		IDsService<M, P> s = (IDsService<M, P>) this.appContext.getBean(key);
		s.setEntityServiceFactories(entityServiceFactories);
		return s;
	}

	public ApplicationContext getAppContext() {
		return appContext;
	}

	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

	public List<IEntityServiceFactory> getEntityServiceFactories() {
		return entityServiceFactories;
	}

	public void setEntityServiceFactories(
			List<IEntityServiceFactory> entityServiceFactories) {
		this.entityServiceFactories = entityServiceFactories;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
