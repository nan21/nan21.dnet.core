package net.nan21.dnet.core.presenter.service.ds;

import java.util.List;

import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IDsServiceFactory;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;
import net.nan21.dnet.core.presenter.service.AbstractApplicationContextAware;

public class DsServiceFactory extends AbstractApplicationContextAware implements
		IDsServiceFactory {

	private List<IEntityServiceFactory> entityServiceFactories;

	private String name;

	@SuppressWarnings("unchecked")
	@Override
	public <M, F, P> IDsService<M, F, P> create(String key) {
		IDsService<M, F, P> s = (IDsService<M, F, P>) this
				.getApplicationContext().getBean(key);
		return s;
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
