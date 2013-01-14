package net.nan21.dnet.core.presenter.action;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.action.ISortToken;
import net.nan21.dnet.core.api.descriptor.IViewModelDescriptor;
import net.nan21.dnet.core.api.model.IFilterRule;
import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.session.Session;

public abstract class AbstractQueryBuilder<M, F, P> implements
		IQueryBuilder<M, F, P> {

	/**
	 * Return results starting from this position.
	 */
	private int resultStart;

	/**
	 * Return this number of results.
	 */
	private int resultSize;

	/**
	 * Array of field names to be used in the order by.
	 */
	private String[] sortColumnNames;

	/**
	 * Array of order by sense for each of the order by fields.
	 */
	private String[] sortColumnSense;

	/**
	 * Result data-type class.
	 */
	private Class<M> modelClass;

	/**
	 * Filter -type class. Can be the same as the model class.
	 */
	private Class<F> filterClass;

	/**
	 * Optional parameters
	 */
	private Class<P> paramClass;

	/**
	 * Filter values.
	 */
	protected F filter;

	/**
	 * Advanced filter rules.
	 */
	protected List<IFilterRule> filterRules;

	/**
	 * Optional parameter values.
	 */
	protected P params;

	/**
	 * Model class descriptor.
	 */
	private IViewModelDescriptor<M> descriptor;

	/**
	 * Entity manager
	 */
	private EntityManager em;

	/**
	 * System configuration.
	 */
	private ISystemConfig systemConfig;

	protected Map<String, Object> customFilterItems;
	protected Map<String, Object> defaultFilterItems;
	protected List<String> noFilterItems;

	final static Logger logger = LoggerFactory
			.getLogger(AbstractQueryBuilder.class);

	/**
	 * Set the values for the result range.
	 */
	public IQueryBuilder<M, F, P> addFilter(F filter) {
		this.setFilter(filter);
		return this;
	}

	/**
	 * Set the values for the result range.
	 */
	public IQueryBuilder<M, F, P> addParams(P params) {
		this.params = params;
		return this;
	}

	/**
	 * Set the values for the result range.
	 */
	public IQueryBuilder<M, F, P> addFetchLimit(int resultStart, int resultSize) {
		this.resultSize = resultSize;
		this.resultStart = resultStart;
		return this;
	}

	/**
	 * Inner class to resolve field name and its range type in case of _From,
	 * _To filter fields.
	 * 
	 * @author amathe
	 * 
	 */
	protected class FilterFieldNameAndRangeType {

		public static final int RANGE_FROM = -1;
		public static final int RANGE_TO = 1;
		public static final int NO_RANGE = 0;

		String name;
		int type;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public int getType() {
			return type;
		}

		public void setType(int type) {
			this.type = type;
		}

	}

	protected FilterFieldNameAndRangeType resolveRealFilterFieldNameAndRangeType(
			Field field) {

		String fieldName = field.getName();
		FilterFieldNameAndRangeType r = new FilterFieldNameAndRangeType();

		if (fieldName.endsWith("_From")) {

			fieldName = fieldName.substring(0, fieldName.length() - 5);
			r.setName(fieldName);
			r.setType(FilterFieldNameAndRangeType.RANGE_FROM);

		} else if (fieldName.endsWith("_To")) {

			fieldName = fieldName.substring(0, fieldName.length() - 3);
			r.setName(fieldName);
			r.setType(FilterFieldNameAndRangeType.RANGE_TO);

		} else {

			r.setName(fieldName);
			r.setType(FilterFieldNameAndRangeType.NO_RANGE);

		}
		return r;
	}

	protected boolean isValidFilterField(Field field, List<String> excludes) {
		if (!Modifier.isStatic(field.getModifiers())) {
			if (!excludes.contains(field.getName())) {
				return true;
			}
		}
		return false;
	}

	protected boolean shouldProcessFilterField(String fieldName,
			String filterFieldName) {
		if (!(this.noFilterItems != null && this.noFilterItems
				.contains(fieldName))
				&& !(this.customFilterItems != null && this.customFilterItems
						.containsKey(filterFieldName))) {
			return true;
		}
		return false;
	}

	/**
	 * Add order by information.
	 */
	public IQueryBuilder<M, F, P> addSortInfo(String[] columnList,
			String[] senseList) {
		this.sortColumnNames = columnList;
		this.sortColumnSense = senseList;
		return this;
	}

	/**
	 * Add order by information.
	 */
	@Override
	public IQueryBuilder<M, F, P> addSortInfo(
			List<? extends ISortToken> sortTokens) {
		if (sortTokens != null) {
			int len = sortTokens.size();
			int i = 0;
			this.sortColumnNames = new String[len];
			this.sortColumnSense = new String[len];

			for (ISortToken token : sortTokens) {
				this.sortColumnNames[i] = token.getProperty();
				this.sortColumnSense[i] = token.getDirection();
				i++;
			}
		}
		return this;
	}

	/**
	 * Add order by information
	 */
	public IQueryBuilder<M, F, P> addSortInfo(String columns, String sense) {
		if (columns != null && !"".equals(columns) && sense != null
				&& !"".equals(sense)) {
			this.sortColumnNames = columns.split(",");
			this.sortColumnSense = sense.split(",");
			if (this.sortColumnNames.length != this.sortColumnSense.length) {
				// TODO: throw error
			}
		}
		return this;
	}

	public IQueryBuilder<M, F, P> addSortInfo(String[] sortTokens)
			throws Exception {
		int len = sortTokens.length;
		this.sortColumnNames = new String[len];
		this.sortColumnSense = new String[len];
		for (int i = 0; i < len; i++) {
			String[] tmp = sortTokens[i].split(" ");
			int l = tmp.length;
			if (l == 1) {
				this.sortColumnNames[i] = tmp[0];
				this.sortColumnSense[i] = "asc";
			} else if (l == 2) {
				this.sortColumnNames[i] = tmp[0];
				this.sortColumnSense[i] = tmp[1];
			} else {
				throw new Exception("Invalid sort token: " + sortTokens[i]);
			}
		}
		return this;
	}

	public Class<M> getModelClass() {
		return modelClass;
	}

	public void setModelClass(Class<M> modelClass) {
		this.modelClass = modelClass;
	}

	public Class<F> getFilterClass() {
		return filterClass;
	}

	public void setFilterClass(Class<F> filterClass) {
		this.filterClass = filterClass;
	}

	public Class<P> getParamClass() {
		return paramClass;
	}

	public void setParamClass(Class<P> paramClass) {
		this.paramClass = paramClass;
	}

	public F getFilter() {
		return filter;
	}

	public void setFilter(F filter) {
		this.filter = filter;
		if (filter instanceof IModelWithClientId) {
			((IModelWithClientId) filter).setClientId(Session.user.get()
					.getClientId());
		}
	}

	public P getParams() {
		return params;
	}

	public void setParams(P params) {
		this.params = params;
	}

	public IViewModelDescriptor<M> getDescriptor() {
		return descriptor;
	}

	public void setDescriptor(IViewModelDescriptor<M> descriptor) {
		this.descriptor = descriptor;
	}

	public EntityManager getEntityManager() {
		return em;
	}

	public void setEntityManager(EntityManager em) {
		this.em = em;
	}

	public int getResultStart() {
		return resultStart;
	}

	public void setResultStart(int resultStart) {
		this.resultStart = resultStart;
	}

	public int getResultSize() {
		return resultSize;
	}

	public void setResultSize(int resultSize) {
		this.resultSize = resultSize;
	}

	public ISystemConfig getSystemConfig() {
		return systemConfig;
	}

	public void setSystemConfig(ISystemConfig systemConfig) {
		this.systemConfig = systemConfig;
	}

	public String[] getSortColumnNames() {
		return sortColumnNames;
	}

	public void setSortColumnNames(String[] sortColumnNames) {
		this.sortColumnNames = sortColumnNames;
	}

	public String[] getSortColumnSense() {
		return sortColumnSense;
	}

	public void setSortColumnSense(String[] sortColumnSense) {
		this.sortColumnSense = sortColumnSense;
	}

	public List<IFilterRule> getFilterRules() {
		return filterRules;
	}

	public void setFilterRules(List<IFilterRule> filterRules) {
		this.filterRules = filterRules;
	}

	@Override
	public IQueryBuilder<M, F, P> addFilterRules(
			List<? extends IFilterRule> filterRules) {
		this.filterRules = new ArrayList<IFilterRule>();
		for (IFilterRule r : filterRules) {
			this.filterRules.add(r);
		}
		return this;
	}

}
