package net.nan21.dnet.core.business.service;

import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class EntityServiceFactory implements IEntityServiceFactory,
		ApplicationContextAware {

	private ApplicationContext applicationContext;

	@Override
	public <E> IEntityService<E> create(String key) {
		@SuppressWarnings("unchecked")
		IEntityService<E> s = (IEntityService<E>) this.applicationContext
				.getBean(key);
		return s;
	}

	public <E> IEntityService<E> create(Class<E> type) {
		@SuppressWarnings("unchecked")
		IEntityService<E> s = (IEntityService<E>) this.applicationContext
				.getBean(type);
		return s;
	}

	public ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	public void setApplicationContext(ApplicationContext applicationContext) {
		this.applicationContext = applicationContext;
	}

}