package net.nan21.dnet.core.presenter.service;

import java.util.List;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;

import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;
import net.nan21.dnet.core.api.setup.AbstractSetupParticipant;

public abstract class AbstractPresenterSetupParticipant extends
		AbstractSetupParticipant {

	protected List<IEntityServiceFactory> entityServiceFactories;

	public <E> IEntityService<E> findEntityService(Class<E> entityClass)
			throws Exception {

		for (IEntityServiceFactory esf : getEntityServiceFactories()) {
			try {
				IEntityService<E> es = esf.create(entityClass.getSimpleName()
						+ "Service"); // this.getEntityClass()
				if (es != null) {
					return es;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(entityClass.getSimpleName() + "Service"
				+ " not found ");
	}

	public List<IEntityServiceFactory> getEntityServiceFactories() {
		if (entityServiceFactories == null) {
			entityServiceFactories = (List<IEntityServiceFactory>) appContext
					.getBean("osgiEntityServiceFactories");
		}
		return entityServiceFactories;
	}

}
