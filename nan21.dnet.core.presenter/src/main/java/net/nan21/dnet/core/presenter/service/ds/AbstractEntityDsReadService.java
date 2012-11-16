package net.nan21.dnet.core.presenter.service.ds;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.eclipse.persistence.config.HintValues;
import org.eclipse.persistence.config.QueryHints;
import org.eclipse.persistence.jpa.JpaQuery;
import org.eclipse.persistence.queries.Cursor;

import net.nan21.dnet.core.api.action.IDsExport;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.action.ISortToken;
import net.nan21.dnet.core.api.model.IFilterRule;
import net.nan21.dnet.core.presenter.action.QueryBuilderWithJpql;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;

/**
 * Implements the read actions for an entity-ds. See the super-classes for more
 * details.
 * 
 * @author amathe
 * 
 * @param <M>
 * @param <F>
 * @param <P>
 * @param <E>
 */
public abstract class AbstractEntityDsReadService<M extends AbstractDsModel<E>, F, P, E>
		extends AbstractEntityDsBaseService<M, F, P, E> {

	private static final int DEFAULT_RESULT_START = 0;
	private static final int DEFAULT_RESULT_SIZE = 500;

	/* ========================== QUERY =========================== */

	/**
	 * Count results for the given query context.
	 * 
	 * @param filter
	 * @param params
	 * @param builder
	 * @return
	 * @throws Exception
	 */
	public Long count(IQueryBuilder<M, F, P> builder) throws Exception {
		if (builder == null) {
			throw new Exception(
					"Cannot run a count query with null query builder.");
		}
		QueryBuilderWithJpql<M, F, P> bld = (QueryBuilderWithJpql<M, F, P>) builder;
		Object count = bld.createQueryCount().getSingleResult();
		if (count instanceof Integer) {
			return ((Integer) count).longValue();
		} else {
			return (Long) count;
		}
	}

	public List<M> find(F filter) throws Exception {
		return this.find(filter, null, null, DEFAULT_RESULT_START,
				DEFAULT_RESULT_SIZE, null);
	}

	public List<M> find(F filter, int resultStart, int resultSize)
			throws Exception {
		return this.find(filter, null, null, resultStart, resultSize, null);
	}

	public List<M> find(F filter, P params) throws Exception {
		return this.find(filter, params, null, DEFAULT_RESULT_START,
				DEFAULT_RESULT_SIZE, null);
	}

	public List<M> find(F filter, P params, int resultStart, int resultSize)
			throws Exception {
		return this.find(filter, params, null, resultStart, resultSize, null);
	}

	public List<M> find(F filter, List<IFilterRule> filterRules)
			throws Exception {
		return this.find(filter, null, filterRules, DEFAULT_RESULT_START,
				DEFAULT_RESULT_SIZE, null);
	}

	public List<M> find(F filter, List<IFilterRule> filterRules,
			int resultStart, int resultSize) throws Exception {
		return this.find(filter, null, filterRules, resultStart, resultSize,
				null);
	}

	public List<M> find(F filter, P params, List<IFilterRule> filterRules)
			throws Exception {
		return this.find(filter, params, filterRules, DEFAULT_RESULT_START,
				DEFAULT_RESULT_SIZE, null);
	}

	public List<M> find(F filter, P params, List<IFilterRule> filterRules,
			int resultStart, int resultSize) throws Exception {
		return this.find(filter, params, filterRules, resultStart, resultSize,
				null);
	}

	public List<M> find(F filter, P params, List<IFilterRule> filterRules,
			List<ISortToken> sortTokens) throws Exception {
		return this.find(filter, params, filterRules, DEFAULT_RESULT_START,
				DEFAULT_RESULT_SIZE, sortTokens);
	}

	public List<M> find(F filter, P params, List<IFilterRule> filterRules,
			int resultStart, int resultSize, List<ISortToken> sortTokens)
			throws Exception {
		QueryBuilderWithJpql<M, F, P> bld = null;
		bld = (QueryBuilderWithJpql<M, F, P>) this.createQueryBuilder();
		bld.setFilter(filter);
		bld.setParams(params);
		bld.setFilterRules(filterRules);
		bld.addFetchLimit(resultStart, resultSize);
		return this.find(bld);
	}

	public List<M> find(IQueryBuilder<M, F, P> builder) throws Exception {

		if (builder == null) {
			throw new Exception("Cannot run a query with null query builder.");
		}
		this.preFind(builder);
		QueryBuilderWithJpql<M, F, P> bld = (QueryBuilderWithJpql<M, F, P>) builder;

		List<M> result = new ArrayList<M>();

		List<E> list = bld.createQuery(this.getEntityClass())
				.setFirstResult(bld.getResultStart())
				.setMaxResults(bld.getResultSize()).getResultList();
		for (E e : list) {
			M m = this.getModelClass().newInstance();
			this.getConverter().entityToModel(e, m);
			result.add(m);
		}
		this.postFind(builder, result);
		return result;
	}

	/**
	 * Template method for pre-query.
	 * 
	 * @param filter
	 * @param params
	 * @param builder
	 * @throws Exception
	 */
	protected void preFind(IQueryBuilder<M, F, P> builder) throws Exception {
	}

	protected void postFind(IQueryBuilder<M, F, P> builder, List<M> result)
			throws Exception {
	}

	/**
	 * Find one result by ID
	 * 
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public M findById(Object id) throws Exception {
		return this.findById(id, this.getParamClass().newInstance());
	}

	/**
	 * Find one result by ID
	 * 
	 * @param id
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public M findById(Object id, P params) throws Exception {
		Method setter = this.getFilterClass().getMethod("setId", Object.class);
		F filter = this.getFilterClass().newInstance();
		setter.invoke(filter, id);
		List<M> result = this.find(filter, params, null);
		if (result.size() == 0) {
			return null;
		} else {
			return result.get(0);
		}
	}

	/**
	 * Find results by a list of IDs
	 * 
	 * @param ids
	 * @return
	 * @throws Exception
	 */
	public List<M> findByIds(List<Object> ids) throws Exception {
		// TODO Implement me !
		return null;
	}

	/* ========================== EXPORT =========================== */
	/**
	 * Export data
	 * 
	 * @param filter
	 * @param params
	 * @param builder
	 * @param writer
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public void doExport(IQueryBuilder<M, F, P> builder, IDsExport<M> writer)
			throws Exception {

		QueryBuilderWithJpql<M, F, P> bld = (QueryBuilderWithJpql<M, F, P>) builder;
		bld.setForExport(true);

		EntityManager em = bld.getEntityManager().getEntityManagerFactory()
				.createEntityManager();
		bld.setEntityManager(em);

		try {

			Query q = bld.createQuery(this.getEntityClass())
					.setHint(QueryHints.CURSOR, true)
					.setHint(QueryHints.CURSOR_INITIAL_SIZE, 30)
					.setHint(QueryHints.CURSOR_PAGE_SIZE, 30)
					.setHint(QueryHints.READ_ONLY, HintValues.TRUE)
					.setFirstResult(bld.getResultStart())
					.setMaxResults(bld.getResultSize());

			Cursor c = q.unwrap(JpaQuery.class).getResultCursor();

			M ds;
			writer.begin();
			boolean isFirst = true;
			while (c.hasMoreElements()) {
				ds = getModelClass().newInstance();
				this.getConverter().entityToModel((E) c.nextElement(), ds);
				writer.write(ds, isFirst);
				isFirst = false;
			}
			writer.end();
			c.close();
		} finally {
			em.close();
		}

	}

	/**
	 * Create a new query-builder instance.
	 * 
	 * @return
	 * @throws Exception
	 */
	public IQueryBuilder<M, F, P> createQueryBuilder() throws Exception {
		IQueryBuilder<M, F, P> qb = null;
		if (this.getQueryBuilderClass() == null) {
			qb = new QueryBuilderWithJpql<M, F, P>();
		} else {
			qb = (IQueryBuilder<M, F, P>) this.getQueryBuilderClass()
					.newInstance();
		}
		this._prepareQueryBuilder(qb);
		return qb;
	}

	/**
	 * Prepare the query builder injecting necessary dependencies.
	 * 
	 * @param qb
	 * @throws Exception
	 */
	private void _prepareQueryBuilder(IQueryBuilder<M, F, P> qb)
			throws Exception {
		qb.setModelClass(this.getModelClass());
		qb.setFilterClass(this.getFilterClass());
		qb.setParamClass(this.getParamClass());
		qb.setDescriptor(this.getDescriptor());
		qb.setSystemConfig(this.getSystemConfig());
		if (qb instanceof QueryBuilderWithJpql) {
			QueryBuilderWithJpql<M, F, P> jqb = (QueryBuilderWithJpql<M, F, P>) qb;
			jqb.setEntityManager(this.getEntityService().getEntityManager());
			jqb.setBaseEql("select e from "
					+ this.getEntityClass().getSimpleName() + " e");
			jqb.setBaseEqlCount("select count(1) from "
					+ this.getEntityClass().getSimpleName() + " e");
			if (this.getDescriptor().isWorksWithJpql()) {
				jqb.setDefaultWhere(this.getDescriptor().getJpqlDefaultWhere());
				jqb.setDefaultSort(this.getDescriptor().getJpqlDefaultSort());
			}
		}
	}

}
