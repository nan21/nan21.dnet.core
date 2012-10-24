package net.nan21.dnet.core.api.service;

import java.io.InputStream;
import java.util.List;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.action.IDsExport;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.action.ISortToken;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.model.IFilterRule;

/**
 * Interface to be implemented by any data-source service.
 * 
 * @author amathe
 * 
 * @param <M>
 * @param <P>
 */
public interface IDsService<M, F, P> {

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

	public M findById(Object id, P params) throws Exception;

	public List<M> findByIds(List<Object> ids) throws Exception;

	public List<M> find(F filter) throws Exception;

	public List<M> find(F filter, int resultStart, int resultSize)
			throws Exception;

	public List<M> find(F filter, P params) throws Exception;

	public List<M> find(F filter, P params, int resultStart, int resultSize)
			throws Exception;

	public List<M> find(F filter, List<IFilterRule> filterRules)
			throws Exception;

	public List<M> find(F filter, List<IFilterRule> filterRules,
			int resultStart, int resultSize) throws Exception;

	public List<M> find(F filter, P params, List<IFilterRule> filterRules)
			throws Exception;

	public List<M> find(F filter, P params, List<IFilterRule> filterRules,
			int resultStart, int resultSize) throws Exception;

	public List<M> find(F filter, P params, List<IFilterRule> filterRules,
			List<ISortToken> sortTokens) throws Exception;

	public List<M> find(F filter, P params, List<IFilterRule> filterRules,
			int resultStart, int resultSize, List<ISortToken> sortTokens)
			throws Exception;

	public List<M> find(IQueryBuilder<M, F, P> builder) throws Exception;

	public Long count(F filter, P params, IQueryBuilder<M, F, P> builder)
			throws Exception;

	/**
	 * Handler for basic data import given an input stream. Performs an insert.
	 * 
	 * @param inputStream
	 * @param sourceName
	 * @throws Exception
	 */
	public void doImport(InputStream inputStream, String sourceName)
			throws Exception;

	/**
	 * Handler for basic data import given a file-name as absolute location.
	 * Performs an insert.
	 * 
	 * @param absoluteFileName
	 */
	public void doImport(String absoluteFileName) throws Exception;

	/**
	 * Handler for basic data import given a file-name and directory where it
	 * resides. Performs an insert.
	 * 
	 * @param relativeFileName
	 * @param path
	 */
	public void doImport(String relativeFileName, String path) throws Exception;

	/**
	 * Handler for basic data import given a file-name and directory where it
	 * resides. <br>
	 * Performs an update. <br>
	 * Tries to read the value from the database using the
	 * <code>ukFieldName</code> as an unique key field, apply the changes read
	 * from the file to be imported and updates the result.
	 * 
	 * @param relativeFileName
	 * @param path
	 */
	public void doImport(String absoluteFileName, String ukFieldName,
			int batchSize) throws Exception;

	/**
	 * Handler for basic data import given a file-name and directory where it
	 * resides. <br>
	 * Performs an update. <br>
	 * Tries to read the value from the database using the
	 * <code>ukFieldName</code> as an unique key field, apply the changes read
	 * from the file to be imported and updates the result.
	 * 
	 * @param relativeFileName
	 * @param path
	 */
	public void doImport(String relativeFileName, String path,
			String ukFieldName, int batchSize) throws Exception;

	public void doExport(F filter, P params, IQueryBuilder<M, F, P> builder,
			IDsExport<M> writer) throws Exception;

	public IQueryBuilder<M, F, P> createQueryBuilder() throws Exception;

	public IDsMarshaller<M, F, P> createMarshaller(String dataFormat)
			throws Exception;

	public Class<?> getEntityClass();

	public Class<M> getModelClass();

	public Class<F> getFilterClass();

	public Class<P> getParamClass();

	public void rpcFilter(String procedureName, F filter, P params)
			throws Exception;

	public void rpcData(String procedureName, M ds, P params) throws Exception;

	public void rpcData(String procedureName, List<M> list, P params)
			throws Exception;

	public InputStream rpcFilterStream(String procedureName, F filter, P params)
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
	public ISystemConfig getSystemConfig();

	/**
	 * Setter for system configuration.
	 * 
	 * @param systemConfig
	 */
	public void setSystemConfig(ISystemConfig systemConfig);
}
