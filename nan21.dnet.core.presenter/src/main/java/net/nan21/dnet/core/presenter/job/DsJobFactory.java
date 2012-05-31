package net.nan21.dnet.core.presenter.job;

import java.util.List;

import net.nan21.dnet.core.api.job.IDsJob;
import net.nan21.dnet.core.api.job.IDsJobFactory;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class DsJobFactory implements IDsJobFactory {

	@Autowired
	private ApplicationContext appContext;

	private List<IEntityServiceFactory> entityServiceFactories;

	private String name;
	
	@Override
	public IDsJob create(String key) {
		IDsJob s = (IDsJob) this.appContext.getBean(key);
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
