package net.nan21.dnet.core.presenter.job;

import java.util.List;

import net.nan21.dnet.core.api.job.IDsJob;
import net.nan21.dnet.core.api.job.IDsJobFactory;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;
import net.nan21.dnet.core.presenter.service.AbstractPresenterServiceFactory;

public class DsJobFactory extends AbstractPresenterServiceFactory implements
		IDsJobFactory {

	private List<IEntityServiceFactory> entityServiceFactories;

	private String name;

	@Override
	public IDsJob create(String key) {
		IDsJob s = (IDsJob) this.getApplicationContext().getBean(key);
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
