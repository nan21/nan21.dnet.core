package net.nan21.dnet.core.presenter.action;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.persistence.Query;

import org.eclipse.persistence.config.QueryHints;
import org.eclipse.persistence.queries.FetchGroup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

public class QueryBuilderWithJpql<F, P> extends AbstractQueryBuilder<F, P> {

	final static Logger logger = LoggerFactory
			.getLogger(QueryBuilderWithJpql.class);

	protected String defaultWhere;
	protected StringBuffer where;

	protected String defaultSort;
	protected StringBuffer sort;

	protected String baseEql;
	protected String baseEqlCount;

	protected Map<String, Object> customFilterItems;
	protected Map<String, Object> defaultFilterItems;
	protected List<String> noFilterItems;

	/**
	 * Dirty work-around to avoid eclipselink bug when using fetch-groups with Cursor
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
		logger.info("JQPL data: {}", qs);
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
		logger.info("JQPL count: {}", qs);
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

	private void addFetchJoins(StringBuffer eql) {
		if (this.descriptor.getFetchJoins() != null) {
			Iterator<String> it = this.descriptor.getFetchJoins().keySet()
					.iterator();
			while (it.hasNext()) {
				String p = it.next();
				String type = this.descriptor.getFetchJoins().get(p);
				if (type != null && type.equals("left")) {
					eql.append(" left join fetch " + p);
				} else {
					eql.append(" join fetch " + p);
				}
			}
		}
	}

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

	private void attachSortClause(StringBuffer eql) {
		if (this.sort != null) {
			eql.append(" order by " + sort.toString());
		} else {
			if (defaultSort != null && !defaultSort.equals("")) {
				eql.append(" order by " + defaultSort);
			}
		}
	}

	private void buildSort() {
		if (this.sortColumnNames != null) {
			this.sort = new StringBuffer();
			for (int i = 0; i < this.sortColumnNames.length; i++) {
				if (i > 0) {
					this.sort.append(",");
				}
				this.sort.append(this.entityAlias
						+ "."
						+ this.getDescriptor().getRefPaths().get(
								this.sortColumnNames[i]) + " "
						+ this.sortColumnSense[i]);
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

		Method[] methods = this.getFilterClass().getDeclaredMethods();
		Map<String, String> refpaths = this.descriptor.getRefPaths();
		Map<String, String> jpqlFilterRules = this.descriptor
				.getJpqlFieldFilterRules();

		this.defaultFilterItems = new HashMap<String, Object>();
		for (Method m : methods) {
			if (m.getName().startsWith("get")) {
				String fn = StringUtils.uncapitalize(m.getName().substring(3));
				if (!(this.noFilterItems != null && this.noFilterItems
						.contains(fn))
						&& !(this.customFilterItems != null && this.customFilterItems
								.containsKey(fn))) {

					Object fv = m.invoke(filter);
					if (fv != null) {
						if (m.getReturnType() == java.lang.String.class) {
							if (jpqlFilterRules.containsKey(fn)) {
								addFilterCondition(jpqlFilterRules.get(fn));
								this.defaultFilterItems.put(fn, (String) fv);
							} else {
								if (refpaths.containsKey(fn)) {
									addFilterCondition(entityAlias + "."
											+ refpaths.get(fn) + " like :" + fn);
									this.defaultFilterItems
											.put(fn, (String) fv);
								}
							}
						} else {
							if (jpqlFilterRules.containsKey(fn)) {
								addFilterCondition(jpqlFilterRules.get(fn));
							} else {
								this.addFilterCondition(entityAlias + "."
										+ refpaths.get(fn) + " = :" + fn);
							}
							this.defaultFilterItems.put(fn, fv);
						}
					}
				}
			}
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
		logger.debug("Binding filter params...");
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

	}

	protected void addFetchGroup(Query q) {
		// see the reason of forExport flag
		if (this.forExport) return;
		logger.debug("Adding fetchGroup...");
		FetchGroup fg = new FetchGroup("default");
		fg.setShouldLoad(true);

		if (this.descriptor.getRefPaths() != null) {
			Map<String, String> refPaths = this.descriptor.getRefPaths();
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
		Query q = this.em.createQuery(jpql);
		if (this.descriptor.getNestedFetchJoins() != null) {
			Map<String, String> nestedFetchJoins = this.descriptor
					.getNestedFetchJoins();
			Iterator<String> it = nestedFetchJoins.keySet().iterator();
			while (it.hasNext()) {
				String p = it.next();
				String type = nestedFetchJoins.get(p);
				if (type != null && type.equals("left")) {
					q.setHint(QueryHints.LEFT_FETCH, p);
				} else {
					q.setHint(QueryHints.FETCH, p);
				}
			}
		}
		addFetchGroup(q);
		bindFilterParams(q);
		return q;
	}

	public Query createQueryCount() throws Exception {
		Query q = this.em.createQuery(this.buildCountStatement());
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
