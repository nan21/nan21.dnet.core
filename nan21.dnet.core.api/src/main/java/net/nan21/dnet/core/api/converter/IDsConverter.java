package net.nan21.dnet.core.api.converter;

import java.util.List;

import javax.persistence.EntityManager;

import net.nan21.dnet.core.api.service.IEntityServiceFactory;

/**
 * Interface to be implemented by a view-object entity converter 
 * @author amathe
 *
 * @param <M>
 * @param <E>
 */
public interface IDsConverter<M, E> {

	public EntityManager getEntityManager();
	public void setEntityManager(EntityManager em);
	
	public void modelToEntity(M m, E e) throws Exception ;
	public void entityToModel(E e, M m) throws Exception ;
	
	public List<IEntityServiceFactory> getEntityServiceFactories();
	public void setEntityServiceFactories(
			List<IEntityServiceFactory> entityServiceFactories);
}
