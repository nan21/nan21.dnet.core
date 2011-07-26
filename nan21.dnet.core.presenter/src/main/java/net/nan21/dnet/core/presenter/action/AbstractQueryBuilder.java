package net.nan21.dnet.core.presenter.action;

import javax.persistence.EntityManager;

import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.descriptor.IViewModelDescriptor;

public abstract class AbstractQueryBuilder<F, P> implements IQueryBuilder<F,P> {

	protected int resultStart;
	protected int resultSize;
	
	protected String[] sortColumnNames;
	protected String[] sortColumnSense;
	
	private Class<F> filterClass;
	private Class<P> paramClass;
	
	protected F filter;
	protected P params;
	
	protected IViewModelDescriptor<F> descriptor;
	protected EntityManager em;	
	
	public IQueryBuilder<F,P> addFetchLimit(int resultStart, int resultSize) {
		this.resultSize = resultSize;
		this.resultStart = resultStart;
		return this;
	}

	 
	public IQueryBuilder<F,P> addSortInfo(String[] columnList, String[] senseList) {
		this.sortColumnNames = columnList;
		this.sortColumnSense = senseList;
		return this;
	}

	 
	public IQueryBuilder<F,P> addSortInfo(String columns, String sense) {
		if (columns != null && sense != null) {
			this.sortColumnNames = columns.split(",");
			this.sortColumnSense = sense.split(",");
			if (this.sortColumnNames.length != this.sortColumnSense.length) {
				//TODO: throw error
			}		
		}		 
		return this;
	}

	 
	public IQueryBuilder<F,P> addSortInfo(String[] sortTokens) {		
		return this;
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
	}


	public P getParams() {
		return params;
	}


	public void setParams(P params) {
		this.params = params;
	}


	public IViewModelDescriptor<F> getDescriptor() {
		return descriptor;
	}


	public void setDescriptor(IViewModelDescriptor<F> descriptor) {
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

	
}
