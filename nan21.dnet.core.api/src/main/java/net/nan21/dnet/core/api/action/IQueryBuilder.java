package net.nan21.dnet.core.api.action;

import java.util.List;

import net.nan21.dnet.core.api.SystemConfig;
import net.nan21.dnet.core.api.descriptor.IViewModelDescriptor;

public interface IQueryBuilder<F,P> {

	/**
	 * Add fetch limit constraint. <br>
	 * Fetch <code>resultSize</code> number of results starting from <code>resultStart</code> position.
	 * @param resultStart
	 * @param resultSize
	 * @return this
	 */
	public IQueryBuilder<F,P> addFetchLimit(int resultStart, int resultSize);
	/**
	 * Add sort information. The number of elements in the two arrays must be the same.
	 * @param columnList Array of field names E.g. {"name", "code"}
	 * @param senseList Array of sense E.g. {"asc", "desc"}
	 * @return this
	 */
	public IQueryBuilder<F,P> addSortInfo(String[] columnList, String[] senseList);
	/**
	 * Add sort information. The number of elements in the strings must be the same.
	 * @param columns Comma delimited column names E.g. "name,code"
	 * @param sense Comma delimited column names E.g. "asc,desc"
	 * @return this
	 */
	public IQueryBuilder<F,P> addSortInfo(String columns, String sense);
	
	/**
	 * Add sort information. 
	 * @param sortTokens The sort tokens E.g. {"name", "code desc", "id asc"}
	 * @return this
	 * @throws Exception 
	 */
	public IQueryBuilder<F,P> addSortInfo(String[] sortTokens) throws Exception;
	 
	/**
	 * Add sort information. 
	 * @param sortTokens 
	 * @return this
	 */
	public IQueryBuilder<F,P> addSortInfo(List<SortToken> sortTokens);
	
	public Class<F> getFilterClass();
	public void setFilterClass(Class<F> filterClass);
	
	public Class<P> getParamClass();
	public void setParamClass(Class<P> paramClass);
 
	
	public F getFilter();
	public void setFilter(F filter);

	public P getParams();
	public void setParams(P params);

	public IViewModelDescriptor<F> getDescriptor();
	public void setDescriptor(IViewModelDescriptor<F> descriptor);
	
	/**
	 * Getter for system configuration.
	 * @return
	 */
	public SystemConfig getSystemConfig();

	/**
	 * Setter for system configuration.
	 * @param systemConfig
	 */
	public void setSystemConfig(SystemConfig systemConfig) ;
 
}
