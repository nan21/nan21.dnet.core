package net.nan21.dnet.core.business.job;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import net.nan21.dnet.core.api.job.IEntityJob;
import net.nan21.dnet.core.api.job.IEntityJobFactory;

public class EntityJobFactory implements IEntityJobFactory {

	@Autowired
	private ApplicationContext appContext;

	@Override
	public IEntityJob create(String key) {
		IEntityJob s = (IEntityJob) this.appContext.getBean(key);
		return s;
	}

	public ApplicationContext getAppContext() {
		return appContext;
	}

	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}
}
