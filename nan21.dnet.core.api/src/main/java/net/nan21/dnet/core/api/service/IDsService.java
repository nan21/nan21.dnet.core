package net.nan21.dnet.core.api.service;

import java.util.List;

import net.nan21.dnet.core.api.action.IExportWriter;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.descriptor.IDsDescriptor;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.model.IDsModel;
import net.nan21.dnet.core.api.model.IDsParam;
/**
 * Interface to be implemented by custom data-source services.
 * @author amathe
 *
 * @param <M>
 * @param <P>
 * @param <E>
 */
public interface IDsService<M extends IDsModel<?>, P extends IDsParam> {

	public IDsDescriptor getDescriptor();
	public void setDescriptor(IDsDescriptor descriptor);

	//public EntityManager getEntityManager();
	//public void setEntityManager(EntityManager em);
	
	public IEntityService getEntityService() throws Exception;
	public void setEntityService(IEntityService entityService);

	//public IDsConverter<M, E> getConverter() throws Exception;
	//public void setConverter(IDsConverter<M, E> converter);

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

	public void export(M filter, P params, IQueryBuilder<M, P> builder,
			IExportWriter writer) throws Exception;

	public IQueryBuilder<M, P> createQueryBuilder() throws Exception;
	public IDsMarshaller<M, P> createMarshaller(String dataFormat) throws Exception;
	
	public void service(String procedureName, M ds) throws Exception;
	public void service(String procedureName, List<M> list) throws Exception;

	public Class<?> getEntityClass(); 
	
	public List<IEntityServiceFactory> getEntityServiceFactories();
	public void setEntityServiceFactories(
			List<IEntityServiceFactory> entityServiceFactories);
	
}
