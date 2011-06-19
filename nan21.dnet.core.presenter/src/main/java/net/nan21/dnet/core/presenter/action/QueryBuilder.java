package net.nan21.dnet.core.presenter.action;

import net.nan21.dnet.core.api.action.IQueryBuilder;

public class QueryBuilder implements IQueryBuilder{

	private int resultStart;
	private int resultSize;
	
	private String[] sortColumnNames;
	private String[] sortColumnSense;
	
	public IQueryBuilder addFetchLimit(int resultStart, int resultSize) {
		this.resultSize = resultSize;
		this.resultStart = resultStart;
		return this;
	}

	 
	public IQueryBuilder addSortInfo(String[] columnList, String[] senseList) {
		this.sortColumnNames = columnList;
		this.sortColumnSense = senseList;
		return this;
	}

	 
	public IQueryBuilder addSortInfo(String columns, String sense) {
		if (columns != null && sense != null) {
			this.sortColumnNames = columns.split(",");
			this.sortColumnSense = sense.split(",");
			if (this.sortColumnNames.length != this.sortColumnSense.length) {
				//TODO: throw error
			}		
		}		 
		return this;
	}

	 
	public IQueryBuilder addSortInfo(String[] sortTokens) {
		// TODO Auto-generated method stub
		return this;
	}

}
