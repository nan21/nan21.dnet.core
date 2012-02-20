package net.nan21.dnet.core.api.converter;

import javax.persistence.EntityManager;

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
	
	public void modelToEntity(M m, E e, boolean isInsert) throws Exception ;
	public void entityToModel(E e, M m) throws Exception ;
	
//	public List<IEntityServiceFactory> getEntityServiceFactories();
//	public void setEntityServiceFactories(
//			List<IEntityServiceFactory> entityServiceFactories);
}
