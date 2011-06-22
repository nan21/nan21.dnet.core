package net.nan21.dnet.core.presenter.converter;

import java.util.List;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;

import net.nan21.dnet.core.api.converter.IDsConverter;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;

public abstract class AbstractDsConverter<M, E> implements IDsConverter<M, E>{

	protected EntityManager em;
	private List<IEntityServiceFactory> entityServiceFactories;
	
	protected IEntityService<?> getService(Class<? extends IEntityService<?>> service) throws Exception {
		
			//TODO: enhance to use a bundleID instead of iterating 
			//through all the available entityServiceFactories
			// extract it .. -> See also AbstractDsConverter
			
			for(IEntityServiceFactory esf: entityServiceFactories) {
				try {
					IEntityService<?> es = esf.create(service);
					if (es != null) {
						 
						return es;
					}					
				} catch(NoSuchBeanDefinitionException e) {
					// service not found in this factory, ignore 		
				}				
			}
			throw new Exception (service.getCanonicalName() + " not found ");
 
	}
	public void entityToModel(E e, M m) throws Exception {		
		this.entityToModelAttributes(e, m);
		this.entityToModelReferences(e, m);
	}
	protected void entityToModelAttributes(E e, M m) throws Exception {		
	}
	protected void entityToModelReferences(E e, M m)  throws Exception {		 
	} 
	
	public void modelToEntity(M m, E e) throws Exception  {
		this.modelToEntityAttributes(m, e);
		this.modelToEntityReferences(m, e);
	}
	protected void modelToEntityAttributes(M m, E e)  throws Exception  {
		 	
	}
	protected void modelToEntityReferences(M m, E e)  throws Exception  {
		 	
	}

	public EntityManager getEntityManager() {
		return this.em;
	}

	public void setEntityManager(EntityManager em) {
		this.em = em;
	}
	public List<IEntityServiceFactory> getEntityServiceFactories() {
		return entityServiceFactories;
	}
	public void setEntityServiceFactories(
			List<IEntityServiceFactory> entityServiceFactories) {
		this.entityServiceFactories = entityServiceFactories;
	}
	
	
	
}
