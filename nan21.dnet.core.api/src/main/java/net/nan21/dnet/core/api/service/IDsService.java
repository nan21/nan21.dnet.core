package net.nan21.dnet.core.api.service;

import java.io.InputStream;
import java.util.List;

import net.nan21.dnet.core.api.SystemConfig;
import net.nan21.dnet.core.api.action.IDsExport;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;

/**
 * Interface to be implemented by any data-source service.
 * 
 * @author amathe
 * 
 * @param <M>
 * @param <P>
 */
public interface IDsService<M, P> {

	/**
	 * Handler for insert event.
	 * 
	 * @param ds
	 *            data-source instance
	 */
	public void insert(M ds, P params) throws Exception;

	/**
	 * Handler for insert event.
	 * 
	 * @param list
	 *            data-source instances list
	 */
	public void insert(List<M> list, P params) throws Exception;

	/**
	 * Handler for update event.
	 * 
	 * @param ds
	 *            data-source instance
	 */
	public void update(M ds, P params) throws Exception;

	/**
	 * Handler for update event.
	 * 
	 * @param list
	 *            data-source instances list
	 */
	public void update(List<M> list, P params) throws Exception;

	// public void delete(M id) throws Exception;
	// public void delete(List<M> list) throws Exception;

	/**
	 * Handler for delete given a data-source id.
	 * 
	 * @param id
	 */
	public void deleteById(Object id) throws Exception;

	/**
	 * Handler for delete given a list of data-source id`s.
	 * 
	 * @param ids
	 */
	public void deleteByIds(List<Object> ids) throws Exception;

	public M findById(Object id) throws Exception;

	public List<M> findByIds(List<Object> ids) throws Exception;

	public List<M> find(M filter, P params, IQueryBuilder<M, P> builder)
			throws Exception;

	public Long count(M filter, P params, IQueryBuilder<M, P> builder)
			throws Exception;

	/**
	 * Handler for basic data import given a file-name as absolute location.
	 * 
	 * @param absoluteFileName
	 */
	public void doImport(String absoluteFileName) throws Exception;

	/**
	 * Handler for basic data import given a file-name and directory where it
	 * resides .
	 * 
	 * @param relativeFileName
	 * @param path
	 */
	public void doImport(String relativeFileName, String path) throws Exception;

	public void doExport(M filter, P params, IQueryBuilder<M, P> builder,
			IDsExport<M> writer) throws Exception;

	public IQueryBuilder<M, P> createQueryBuilder() throws Exception;

	public IDsMarshaller<M, P> createMarshaller(String dataFormat)
			throws Exception;

	public Class<?> getEntityClass();

	public Class<M> getModelClass();

	public Class<P> getParamClass();

	public List<IEntityServiceFactory> getEntityServiceFactories();

	public void setEntityServiceFactories(
			List<IEntityServiceFactory> entityServiceFactories);

	public List<IDsServiceFactory> getDsServiceFactories();

	public void setDsServiceFactories(List<IDsServiceFactory> dsServiceFactories);

	public void rpcFilter(String procedureName, M filter, P params)
			throws Exception;

	public void rpcData(String procedureName, M ds, P params) throws Exception;

	public void rpcData(String procedureName, List<M> list, P params)
			throws Exception;

	public InputStream rpcFilterStream(String procedureName, M filter, P params)
			throws Exception;

	public InputStream rpcDataStream(String procedureName, M ds, P params)
			throws Exception;

	public InputStream rpcDataStream(String procedureName, List<M> list,
			P params) throws Exception;

	/**
	 * Getter for system configuration.
	 * 
	 * @return
	 */
	public SystemConfig getSystemConfig();

	/**
	 * Setter for system configuration.
	 * 
	 * @param systemConfig
	 */
	public void setSystemConfig(SystemConfig systemConfig);
}
