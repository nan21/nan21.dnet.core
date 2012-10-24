package net.nan21.dnet.core.presenter.service;

import net.nan21.dnet.core.presenter.action.AbstractQueryBuilder;

/**
 * Abstract base class for query-enabled presenter-service hierarchy. It works
 * with a model-type(M) which represents the returned data, optionally using a
 * filter-type (F) and a parameter-type(P) input.
 * 
 * @author amathe
 * 
 * @param <M>
 *            returned data-type
 * @param <F>
 *            optional filter-type, can be the same as the model-type
 * @param <P>
 *            optional parameter-type
 */
public abstract class AbstractPresenterReadService<M, F, P> extends
		AbstractPresenterBaseService {

	private Class<M> modelClass;
	private Class<F> filterClass;
	private Class<P> paramClass;

	private Class<? extends AbstractQueryBuilder<M, F, P>> queryBuilderClass;

	public Class<M> getModelClass() {
		return modelClass;
	}

	public void setModelClass(Class<M> modelClass) throws Exception {
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

	public Class<? extends AbstractQueryBuilder<M, F, P>> getQueryBuilderClass() {
		return queryBuilderClass;
	}

	public void setQueryBuilderClass(
			Class<? extends AbstractQueryBuilder<M, F, P>> queryBuilderClass) {
		this.queryBuilderClass = queryBuilderClass;
	}
}
