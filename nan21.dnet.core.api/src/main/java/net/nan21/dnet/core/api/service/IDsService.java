package net.nan21.dnet.core.api.service;

import java.util.List;

import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
/**
 * Interface to be implemented by custom data-source services.
 * @author amathe
 *
 * @param <M>
 * @param <P>
 * @param <E>
 */
public interface IDsService<M, P> {
  
	//public  IEntityService<E> getEntityService() throws Exception;
	//public void setEntityService(IEntityService<E> entityService);

	public void insert(M ds) throws Exception;
	public void insert(List<M> list) throws Exception;

	public void update(M ds) throws Exception;
	public void update(List<M> list) throws Exception;

	public void deleteById(Object id) throws Exception;
	public void deleteByIds(List<Object> ids) throws Exception;

	public M findById(Object id) throws Exception;
	public List<M> findByIds(List<Object> ids) throws Exception;

	public List<M> find(M filter, P params, IQueryBuilder<M, P> builder) throws Exception;
	public Long count(M filter, P params, IQueryBuilder<M, P> builder) throws Exception;

	public void doImport(String absoluteFileName) throws Exception ;
	public void doImport(String relativeFileName, String path) throws Exception ;

	public IQueryBuilder<M, P> createQueryBuilder() throws Exception;
	public IDsMarshaller<M, P> createMarshaller(String dataFormat) throws Exception;

	public Class<?> getEntityClass(); 
	
	public List<IEntityServiceFactory> getEntityServiceFactories();
	public void setEntityServiceFactories(
			List<IEntityServiceFactory> entityServiceFactories);
	
	public List<IDsServiceFactory> getDsServiceFactories();
	public void setDsServiceFactories(List<IDsServiceFactory> dsServiceFactories);
	
	public void rpcFilter(String procedureName, M filter, P params) throws Exception;
	public void rpcData(String procedureName, M ds, P params) throws Exception;	
	public void rpcData(String procedureName, List<M> list, P params) throws Exception;
}
