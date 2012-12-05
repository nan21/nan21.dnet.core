package net.nan21.dnet.core.presenter.action;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.persistence.Parameter;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import net.nan21.dnet.core.api.model.IFilterRule;
import net.nan21.dnet.core.presenter.model.FilterRule;

import org.eclipse.persistence.config.QueryHints;
import org.eclipse.persistence.queries.FetchGroup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

public class QueryBuilderWithJpql<M, F, P> extends
		AbstractQueryBuilder<M, F, P> {

	public static final String OP_LIKE = "like";
	public static final String OP_NOT_LIKE = "not like";

	public static final String OP_EQ = "=";
	public static final String OP_NOT_EQ = "<>";

	public static final String OP_LT = "<";
	public static final String OP_LT_EQ = "<=";

	public static final String OP_GT = ">";
	public static final String OP_GT_EQ = ">=";

	public static final String OP_BETWEEN = "between";

	private static final String OP_IN = "in";
	private static final String OP_NOT_IN = "not in";

	final static Logger logger = LoggerFactory
			.getLogger(QueryBuilderWithJpql.class);

	protected String defaultWhere;
	protected StringBuffer where;

	protected String defaultSort;
	protected StringBuffer sort;

	protected String baseEql;
	protected String baseEqlCount;

	/**
	 * Dirty work-around to avoid eclipselink bug when using fetch-groups with
	 * Cursor
	 * 
	 */
	protected boolean forExport;

	private String entityAlias = "e";

	public String getBaseEql() {
		return baseEql;
	}

	public void setBaseEql(String baseEql) {
		this.baseEql = baseEql;
	}

	public String getBaseEqlCount() {
		return baseEqlCount;
	}

	public void setBaseEqlCount(String baseEqlCount) {
		this.baseEqlCount = baseEqlCount;
	}

	/**
	 * Create the query statement to fetch the result data which match the
	 * filter criteria.<br>
	 * Can be customized through the <code>before</code>, <code>on</code> and
	 * <code>after</code> methods.
	 * 
	 * @return
	 * @throws Exception
	 */
	public String buildQueryStatement() throws Exception {
		beforeBuildQueryStatement();
		String qs = onBuildQueryStatement();
		afterBuildQueryStatement(qs);
		if (logger.isDebugEnabled()) {
			logger.debug("JQPL to execute: {}", qs);
		}
		return qs;
	}

	/**
	 * Template method to override with custom implementation. Fragments used in
	 * onBuildQueryStatement can be overriden.
	 * 
	 * @throws Exception
	 */
	protected void beforeBuildQueryStatement() throws Exception {
	}

	/**
	 * Creates the JPQL query statement used to fetch the result data. It adds
	 * to <code>baseEql</code> the jpql fragments according to filter criteria,
	 * sort information and meta information provided by the model class.
	 * Customize it with the <code>before</code> and <code>after</code> methods
	 * or you can entirely override.
	 * 
	 * @return
	 * @throws Exception
	 */
	protected String onBuildQueryStatement() throws Exception {
		StringBuffer eql = new StringBuffer(this.baseEql);
		this.addFetchJoins(eql);
		this.buildWhere();
		this.attachWhereClause(eql);
		this.buildSort();
		this.attachSortClause(eql);

		return eql.toString();
	}

	/**
	 * Post query string creation code.
	 * 
	 * @param builtQueryStatement
	 *            : The query statement which has been built.
	 * @throws Exception
	 */
	protected void afterBuildQueryStatement(String builtQueryStatement)
			throws Exception {

	}

	/**
	 * Create the count query statement to count the total number of results
	 * which match the filter criteria.<br>
	 * Can be customized through the <code>before</code>, <code>on</code> and
	 * <code>after</code> methods.
	 * 
	 * @return
	 * @throws Exception
	 */
	public String buildCountStatement() throws Exception {
		beforeBuildCountStatement();
		String qs = onBuildCountStatement();
		afterBuildCountStatement(qs);
		if (logger.isDebugEnabled()) {
			logger.debug("count JQPL to execute: {}", qs);
		}
		return qs;
	}

	protected void beforeBuildCountStatement() throws Exception {

	}

	protected String onBuildCountStatement() throws Exception {
		StringBuffer eql = new StringBuffer(this.baseEqlCount);
		this.addFetchJoins(eql);
		this.attachWhereClause(eql);
		return eql.toString();
	}

	protected void afterBuildCountStatement(String builtQueryStatement)
			throws Exception {

	}

	/**
	 * Append fetch joins based on the model descriptor.
	 * 
	 * @param eql
	 */
	private void addFetchJoins(StringBuffer eql) {
		if (logger.isDebugEnabled()) {
			logger.debug("Adding fetch joins ... ");
		}
		if (this.getDescriptor().getFetchJoins() != null) {
			Iterator<String> it = this.getDescriptor().getFetchJoins().keySet()
					.iterator();
			while (it.hasNext()) {
				String p = it.next();
				String type = this.getDescriptor().getFetchJoins().get(p);
				if (type != null && type.equals("left")) {
					eql.append(" left join fetch " + p);
				} else {
					eql.append(" join fetch " + p);
				}
			}
		}
	}

	/**
	 * Append where clause. Use the default where as well as the calculated one
	 * based on the filter criteria.
	 * 
	 * @param eql
	 */
	private void attachWhereClause(StringBuffer eql) {
		if ((this.where != null && !this.where.equals(""))
				|| (this.defaultWhere != null && !this.defaultWhere.equals(""))) {

			eql.append(" where ");
			if (this.defaultWhere != null && !this.defaultWhere.equals("")) {
				eql.append(this.defaultWhere);
			}
			if (where != null && !where.equals("")) {
				if (this.defaultWhere != null && !this.defaultWhere.equals(""))
					eql.append(" and ");
				eql.append(where);
			}
		}
	}

	/**
	 * Append order by. If there is an explicit order by use that one otherwise
	 * use the default one if any.
	 * 
	 * @param eql
	 */
	private void attachSortClause(StringBuffer eql) {
		if (this.sort != null) {
			String orderBy = sort.toString();
			if (logger.isDebugEnabled()) {
				logger.debug("Attaching calculated order by: " + orderBy);
			}
			eql.append(" order by " + orderBy);
		} else {
			if (defaultSort != null && !defaultSort.equals("")) {
				if (logger.isDebugEnabled()) {
					logger.debug("No specific order by, using the default one: "
							+ defaultSort);
				}
				eql.append(" order by " + defaultSort);
			}
		}
	}

	/**
	 * Build order by information.
	 */
	private void buildSort() {
		if (logger.isDebugEnabled()) {
			logger.debug("Building JPQL order by ...");
		}

		String[] sortColumnNames = this.getSortColumnNames();
		String[] sortColumnSense = this.getSortColumnSense();

		if (sortColumnNames != null && sortColumnNames.length > 0) {
			this.sort = new StringBuffer();
			for (int i = 0; i < sortColumnNames.length; i++) {
				if (i > 0) {
					this.sort.append(",");
				}
				if (this.getDescriptor().getOrderBys()
						.containsKey(sortColumnNames[i])) {
					String[] fields = this.getDescriptor().getOrderBys()
							.get(sortColumnNames[i]);

					for (int k = 0, l = fields.length; k < l; k++) {
						if (k > 0) {
							this.sort.append(",");
						}
						this.sort.append(this.entityAlias + "." + fields[k]
								+ " " + sortColumnSense[i]);
					}
				} else {
					this.sort.append(this.entityAlias
							+ "."
							+ this.getDescriptor().getRefPaths()
									.get(sortColumnNames[i]) + " "
							+ sortColumnSense[i]);
				}
			}
		}
	}

	private void buildWhere() throws Exception {
		beforeBuildWhere();
		onBuildWhere();
		afterBuildWhere();
	}

	protected void beforeBuildWhere() throws Exception {

	}

	protected void onBuildWhere() throws Exception {
		this.processFilter();
		this.processAdvancedFilter();
	}

	private void appendFilterRule1(String source, FilterRule filterRule, int cnt)
			throws Exception {
		String key = filterRule.getFieldName() + "_" + cnt;
		addFilterCondition(entityAlias + "." + source + " "
				+ filterRule.getOperation() + " :" + key);
		String op = filterRule.getOperation();
		if (op.equals(OP_IN) || op.equals(OP_NOT_IN)) {
			String[] inVals = filterRule.getValue1().split(",");
			this.defaultFilterItems.put(key, Arrays.asList(inVals));
		} else {
			this.defaultFilterItems.put(key, filterRule.getConvertedValue1());
		}

	}

	private void appendFilterRule2(String source, FilterRule filterRule, int cnt)
			throws Exception {

		String key1 = filterRule.getFieldName() + "_" + cnt + "_1";
		String key2 = filterRule.getFieldName() + "_" + cnt + "_2";

		addFilterCondition(entityAlias + "." + source + " "
				+ filterRule.getOperation() + " :" + key1 + " and :" + key2);
		this.defaultFilterItems.put(key1, filterRule.getConvertedValue1());
		this.defaultFilterItems.put(key2, filterRule.getConvertedValue2());

	}

	private List<String> operations1 = null;
	private List<String> operations2 = null;

	private void appendJpqlFragmentForFilterRule(FilterRule filterRule,
			String refPath, int cnt) throws Exception {

		String op = filterRule.getOperation();

		if (operations1.contains(op)) {
			appendFilterRule1(refPath, filterRule, cnt);
		}
		if (operations2.contains(op)) {
			appendFilterRule2(refPath, filterRule, cnt);
		}

	}

	protected void processAdvancedFilter() throws Exception {

		if (this.filterRules == null || this.filterRules.size() == 0) {
			return;
		}

		operations1 = Arrays
				.asList(new String[] { OP_LIKE, OP_NOT_LIKE, OP_EQ, OP_NOT_EQ,
						OP_LT, OP_LT_EQ, OP_GT, OP_GT_EQ, OP_IN, OP_NOT_IN });
		operations2 = Arrays.asList(new String[] { OP_BETWEEN });

		Map<String, String> refpaths = this.getDescriptor().getRefPaths();
		Class<?> clz = this.getModelClass();
		Method m = null;
		int cnt = 0;
		for (IFilterRule ifr : this.filterRules) {
			FilterRule fr = (FilterRule) ifr;
			String fieldName = fr.getFieldName();
			if (this.shouldProcessFilterField(fieldName, fieldName)) {
				// get the filter getter
				cnt++;
				try {
					m = clz.getMethod("get" + StringUtils.capitalize(fieldName));
					fr.setDataTypeFQN(m.getReturnType().getCanonicalName());
					this.appendJpqlFragmentForFilterRule(fr,
							refpaths.get(fieldName), cnt);

				} catch (NoSuchMethodException e) {
					throw new Exception("Invalid field name: " + fieldName);
				}

			}

		}

	}

	protected void processFilter() throws Exception {
		if (logger.isDebugEnabled()) {
			logger.debug("Building JPQL where ...");
		}
		Map<String, String> refpaths = this.getDescriptor().getRefPaths();
		Map<String, String> jpqlFilterRules = this.getDescriptor()
				.getJpqlFieldFilterRules();

		this.defaultFilterItems = new HashMap<String, Object>();

		Class<?> clz = this.getFilterClass();

		// The filter object could be a dedicated filter class or the
		// data-source model.
		// Ensure we do not apply filter on the framework specific properties

		List<String> excludes = Arrays.asList(new String[] { "_entity_",
				"__clientRecordId__" });

		while (clz != null) {
			Field[] fields = clz.getDeclaredFields();

			for (Field field : fields) {

				String fieldName = field.getName();

				if (this.isValidFilterField(field, excludes)) {
					String filterFieldName = fieldName;
					FilterFieldNameAndRangeType fnrt = this
							.resolveRealFilterFieldNameAndRangeType(field);
					fieldName = fnrt.getName();

					if (this.shouldProcessFilterField(fieldName,
							filterFieldName)) {

						// get the filter getter
						Method m = null;
						try {
							m = clz.getMethod("get"
									+ StringUtils.capitalize(filterFieldName));
						} catch (Exception e) {
							// break;
						}

						// get the value
						Object fv = m.invoke(getFilter());

						if (fv != null) {
							if (m.getReturnType() == java.lang.String.class) {
								if (jpqlFilterRules.containsKey(fieldName)) {
									addFilterCondition(jpqlFilterRules
											.get(fieldName));
									this.defaultFilterItems.put(fieldName,
											(String) fv);
								} else {
									if (refpaths.containsKey(fieldName)) {
										addFilterCondition(entityAlias + "."
												+ refpaths.get(fieldName)
												+ " like :" + fieldName);
										this.defaultFilterItems.put(fieldName,
												(String) fv);
									}
								}
							} else {
								if (fnrt.getType() != FilterFieldNameAndRangeType.NO_RANGE) {
									if (fnrt.getType() == FilterFieldNameAndRangeType.RANGE_FROM) {
										this.addFilterCondition(entityAlias
												+ "." + refpaths.get(fieldName)
												+ " >= :" + filterFieldName);
									} else {
										this.addFilterCondition(entityAlias
												+ "." + refpaths.get(fieldName)
												+ " < :" + filterFieldName);
									}

									this.defaultFilterItems.put(
											filterFieldName, fv);
								} else {
									if (jpqlFilterRules.containsKey(fieldName)) {
										addFilterCondition(jpqlFilterRules
												.get(fieldName));
									} else {
										this.addFilterCondition(entityAlias
												+ "." + refpaths.get(fieldName)
												+ " = :" + fieldName);
									}
									this.defaultFilterItems.put(fieldName, fv);
								}
							}
						}
					}
				}
			}
			clz = clz.getSuperclass();
		}

	}

	protected void afterBuildWhere() throws Exception {

	}

	public void addFilterCondition(String filter) {
		if (this.where == null) {
			this.where = new StringBuffer();
		}
		if (this.where.length() > 0) {
			this.where.append(" and ");
		}
		this.where.append(filter);
	}

	protected void addCustomFilterItem(String key, Object value) {
		if (this.customFilterItems == null) {
			this.customFilterItems = new HashMap<String, Object>();
		}
		this.customFilterItems.put(key, value);
	}

	private void bindFilterParams(Query q) throws Exception {

		if (this.defaultFilterItems != null) {
			for (String key : this.defaultFilterItems.keySet()) {
				Object value = this.defaultFilterItems.get(key);
				if (value instanceof java.lang.String) {
					q.setParameter(key, ((String) value).replace('*', '%'));
				} else {
					q.setParameter(key, value);
				}
			}
		}
		if (this.customFilterItems != null) {
			for (String key : this.customFilterItems.keySet()) {
				Object value = this.customFilterItems.get(key);
				if (value instanceof java.lang.String) {
					q.setParameter(key, ((String) value).replace('*', '%'));
				} else {
					q.setParameter(key, value);
				}
			}
		}
		if (logger.isDebugEnabled()) {
			logger.debug("Bound filter params:");
			for (Parameter<?> p : q.getParameters()) {
				try {
					logger.debug(" -> " + p.getName() + " = "
							+ q.getParameterValue(p));
				} catch (Exception e) {
					// maybe a parameter has not been bound
				}
			}
		}
	}

	protected void addFetchGroup(Query q) {
		// see the reason of forExport flag
		if (this.forExport || this.getSystemConfig().isDisableFetchGroups())
			return;
		logger.debug("Adding fetchGroup...");
		FetchGroup fg = new FetchGroup("default");
		fg.setShouldLoad(true);

		if (this.getDescriptor().getRefPaths() != null) {
			Map<String, String> refPaths = this.getDescriptor().getRefPaths();
			Iterator<String> it = refPaths.keySet().iterator();
			while (it.hasNext()) {
				String p = it.next();
				fg.addAttribute(refPaths.get(p));
			}
			q.setHint(QueryHints.FETCH_GROUP, fg);
		}

	}

	public Query createQuery() throws Exception {
		String jpql = this.buildQueryStatement();
		Query q = this.getEntityManager().createQuery(jpql);
		createQuery_(q);
		return q;
	}

	public <E> TypedQuery<E> createQuery(Class<E> resultType) throws Exception {
		String jpql = this.buildQueryStatement();
		TypedQuery<E> q = this.getEntityManager().createQuery(jpql, resultType);
		createQuery_(q);
		return q;
	}

	private void createQuery_(Query q) throws Exception {
		if (this.getDescriptor().getQueryHints() != null) {
			Map<String, Object> queryHints = this.getDescriptor()
					.getQueryHints();
			Iterator<String> it = queryHints.keySet().iterator();
			while (it.hasNext()) {
				String p = it.next();
				q.setHint(p, queryHints.get(p));
			}
		}
		addFetchGroup(q);
		bindFilterParams(q);
	}

	public Query createQueryCount() throws Exception {
		Query q = this.getEntityManager().createQuery(
				this.buildCountStatement());
		bindFilterParams(q);
		return q;
	}

	public String getDefaultWhere() {
		return defaultWhere;
	}

	public void setDefaultWhere(String defaultWhere) {
		this.defaultWhere = defaultWhere;
	}

	public String getDefaultSort() {
		return defaultSort;
	}

	public void setDefaultSort(String defaultSort) {
		this.defaultSort = defaultSort;
	}

	public boolean isForExport() {
		return forExport;
	}

	public void setForExport(boolean forExport) {
		this.forExport = forExport;
	}

}
