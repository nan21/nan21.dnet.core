package net.nan21.dnet.core.api.action;

import java.util.List;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.descriptor.IViewModelDescriptor;
import net.nan21.dnet.core.api.model.IFilterRule;

public interface IQueryBuilder<M, F, P> {

	/**
	 * Add fetch limit constraint. <br>
	 * Fetch <code>resultSize</code> number of results starting from
	 * <code>resultStart</code> position.
	 * 
	 * @param resultStart
	 * @param resultSize
	 * @return this
	 */
	public IQueryBuilder<M, F, P> addFetchLimit(int resultStart, int resultSize);

	/**
	 * Add sort information. The number of elements in the two arrays must be
	 * the same.
	 * 
	 * @param columnList
	 *            Array of field names E.g. {"name", "code"}
	 * @param senseList
	 *            Array of sense E.g. {"asc", "desc"}
	 * @return this
	 */
	public IQueryBuilder<M, F, P> addSortInfo(String[] columnList,
			String[] senseList);

	/**
	 * Add sort information. The number of elements in the strings must be the
	 * same.
	 * 
	 * @param columns
	 *            Comma delimited column names E.g. "name,code"
	 * @param sense
	 *            Comma delimited column names E.g. "asc,desc"
	 * @return this
	 */
	public IQueryBuilder<M, F, P> addSortInfo(String columns, String sense);

	/**
	 * Add sort information.
	 * 
	 * @param sortTokens
	 *            The sort tokens E.g. {"name", "code desc", "id asc"}
	 * @return this
	 * @throws Exception
	 */
	public IQueryBuilder<M, F, P> addSortInfo(String[] sortTokens)
			throws Exception;

	/**
	 * Add sort information.
	 * 
	 * @param sortTokens
	 * @return this
	 */
	public IQueryBuilder<M, F, P> addSortInfo(
			List<? extends ISortToken> sortTokens);

	public IQueryBuilder<M, F, P> addFilterRules(
			List<? extends IFilterRule> filterRules);

	public Class<M> getModelClass();

	public void setModelClass(Class<M> modelClass);

	public Class<F> getFilterClass();

	public void setFilterClass(Class<F> filterClass);

	public Class<P> getParamClass();

	public void setParamClass(Class<P> paramClass);

	public F getFilter();

	public void setFilter(F filter);

	public List<IFilterRule> getFilterRules();

	public void setFilterRules(List<IFilterRule> filterRules);

	public IQueryBuilder<M, F, P> addFilter(F filter) throws Exception;

	public P getParams();

	public void setParams(P params);

	public IQueryBuilder<M, F, P> addParams(P params) throws Exception;

	public IViewModelDescriptor<M> getDescriptor();

	public void setDescriptor(IViewModelDescriptor<M> descriptor);

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
