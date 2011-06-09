package net.nan21.dnet.core.presenter.action;

import java.util.Map;

import net.nan21.dnet.core.api.action.IActionContextFind;
 
public class QueryContext implements IActionContextFind{
 
	private int resultStart;
	private int resultSize;
	
	private String orderBy;
	private String defaultOrderBy;
	
	private String[] orderByCol;
	private String[] orderBySense;
	


	
	Map<String, String> refPaths;
	
	private String defaultWhere;
	private String where;
	
	 
	
	public int getResultStart() {
		return this.resultStart;
	}

	public void setResultStart(int resultStart) {
		this.resultStart = resultStart;
	}

	public int getResultSize() {
		return this.resultSize;
	}

	public void setResultSize(int resultSize) {
		this.resultSize = resultSize;
	}

	public String getDefaultOrderBy() {
		return this.defaultOrderBy;
	}

	public void setDefaultOrderBy(String defaultOrderBy) {
		this.defaultOrderBy = defaultOrderBy;
	}

	 
	
	public Map<String, String> getRefPaths() {
		return this.refPaths;
	}

	public void setRefPaths(Map<String, String> refPaths) {
		this.refPaths = refPaths;
	}

	public void setOrderBy(String orderBy) {
		this.orderBy = orderBy;
	}
 
	public String getDefaultWhere() {
		return this.defaultWhere;
	}

	public void setDefaultWhere(String defaultWhere) {
		this.defaultWhere = defaultWhere;
	}

	public String getWhere() {
		return this.where;
	}

	public void setWhere(String where) {
		this.where = where;
	}
 
	public String[] getOrderByCol() {
		return orderByCol;
	}

	public void setOrderByCol(String[] orderByCol) {
		this.orderByCol = orderByCol;
	}

	public String[] getOrderBySense() {
		return orderBySense;
	}

	public void setOrderBySense(String[] orderBySense) {
		this.orderBySense = orderBySense;
	}

	public String getOrderBy() throws Exception {
		if (this.orderBy!= null) {
			return this.orderBy;
		}
		/*
		if (this.orderByCol != null ) {
			 if (this.orderByCol.indexOf(',') > 0) {
				 StringBuffer sb = new StringBuffer();
				 String[] cols = this.orderByCol.split(",");
				 String[] sens = this.orderBySense.split(",");
				 if (cols.length != sens.length) {
					 throw new Exception("Invalid order by specification. Number of tokens for columns dos not match the number of tokens for sense.");
				 }
				 for (int i=0; i<cols.length; i++) {
					 if (i>0) sb.append(',');
					  
						 sb.append( this.refPaths.get(cols[i])+ " " + sens[i]);
					  			 
				 }
				 return sb.toString();
			 } else {
				  
					 return this.refPaths.get(this.orderByCol) + " " + this.orderBySense;
				  			 
			 }					
		}	
		*/
		return this.defaultOrderBy;
		
	} 
	 
	
}
