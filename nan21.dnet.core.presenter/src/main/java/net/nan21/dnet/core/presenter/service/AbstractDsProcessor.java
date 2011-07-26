package net.nan21.dnet.core.presenter.service;

import java.util.List;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.api.service.IDsServiceFactory;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;

public class AbstractDsProcessor<M, P> {
 
	@Autowired
	protected ApplicationContext appContext;
	
	protected List<IEntityServiceFactory> entityServiceFactories;	 
	protected List<IDsServiceFactory> dsServiceFactories;
	
	public IDsService<M,P> findDsService(String dsName) throws Exception {
		IDsService<M,P> srv = null;
		for (IDsServiceFactory f : dsServiceFactories) {
			try {
				srv = f.create(dsName + "Service");
				if (srv != null) {
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		throw new Exception(dsName + "Service not found !");
	}
	
	
	public <E> IEntityService<E> findEntityService(Class<E> entityClass) throws Exception {		 
		for(IEntityServiceFactory esf: entityServiceFactories) {
			try {
				IEntityService<E> es = esf.create(entityClass.getSimpleName() + "Service"); //this.getEntityClass()
				if (es != null) {						 
					return es;
				}					
			} catch(NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore 		
			}				
		}
		throw new Exception (entityClass.getSimpleName() + "Service" + " not found "); 
	}

	public List<IEntityServiceFactory> getEntityServiceFactories() {
		return entityServiceFactories;
	}

	public void setEntityServiceFactories(
			List<IEntityServiceFactory> entityServiceFactories) {
		this.entityServiceFactories = entityServiceFactories;
	}
	
	/*public IEntityService<E> getEntityService() throws Exception {	
		return entityService;
	}
	
	public void setEntityService(IEntityService<E> entityService) {
		this.entityService = entityService;
	}*/

	public ApplicationContext getAppContext() {
		return appContext;
	}
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}
	
	
	public List<IDsServiceFactory> getDsServiceFactories() {
		return dsServiceFactories;
	}
	public void setDsServiceFactories(List<IDsServiceFactory> dsServiceFactories) {
		this.dsServiceFactories = dsServiceFactories;
	}
	 
	
}
