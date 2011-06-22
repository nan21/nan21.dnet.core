package net.nan21.dnet.core.presenter.action;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import org.springframework.util.StringUtils;
 
public class QueryBuilderWithJpql<F, P> extends AbstractQueryBuilder<F, P> {

	protected String defaultWhere;
	protected StringBuffer where;
	
	protected String defaultSort;
	protected StringBuffer sort;
	
	protected String baseEql;

	protected Map<String, Object> customFilterItems;
    protected Map<String, Object> defaultFilterItems;
    protected List<String> noFilterItems;
     
    private String entityAlias = "e";
	public String getBaseEql() {
		return baseEql;
	}
 
	public void setBaseEql(String baseEql) {
		this.baseEql = baseEql;
	}
	
	public String buildQueryStatement() throws Exception {
		 
		StringBuffer eql = new StringBuffer(this.baseEql);
		this.buildJpqlWhere(filter);
		
		if ((where != null && !where.equals(""))
				|| 
				(defaultWhere != null && !defaultWhere.equals(""))) {

			eql.append(" where ");
			if (defaultWhere != null && !defaultWhere.equals("")) {
				eql.append(defaultWhere);
			}
			if (where != null && !where.equals("")) {
				if (defaultWhere != null && !defaultWhere.equals(""))
					eql.append(" and ");
				eql.append(where);
			}
		}
		
		this.buildSort();
		
		if (sort != null) {
			eql.append(" order by " + sort.toString());
		} else {
			if (defaultSort != null && !defaultSort.equals("")) {
				eql.append(" order by " + defaultSort);
			}
		}
		return eql.toString();
	}
	
	private void buildSort() {
		if(this.sortColumnNames != null) {
			this.sort = new StringBuffer();
			for (int i=0; i< this.sortColumnNames.length ; i++ ) {
				if (i > 0) {
					this.sort.append(",");
				}
				this.sort.append( this.entityAlias + "." + this.getDescriptor().getRefPaths().get(this.sortColumnNames[i]) + " " + this.sortColumnSense[i] );
			}			 
		}  
	}
	private void buildJpqlWhere (Object filter) throws Exception {
		  
        Method[] methods = this.getFilterClass().getDeclaredMethods();
        Map<String, String> refpaths = this.descriptor.getRefPaths();
        this.defaultFilterItems = new HashMap<String, Object>();
        for (Method m : methods) {
            if (m.getName().startsWith("get")) {
                String fn = StringUtils.uncapitalize(m.getName().substring(3));
                fn = fn.substring(0, 1).toLowerCase() + fn.substring(1);

                if (!( this.noFilterItems != null && this.noFilterItems.contains(fn) ) 
                			&& 
                	!( this.customFilterItems !=null && this.customFilterItems.containsKey(fn))) {
                	
                    Object fv = m.invoke(filter);
                    if (fv != null) {
                        if (m.getReturnType() == java.lang.String.class) {
                            addFilterCondition( entityAlias+ "."+refpaths.get(fn) + " like :" + fn);
                            this.defaultFilterItems.put(fn, (String) fv);
                        } else {
                            this.addFilterCondition( entityAlias+ "."+refpaths.get(fn) + " = :" + fn);
                            this.defaultFilterItems.put(fn, fv);
                        }
                       // addAnd = true;
                    }
                }
            }
        }
	    
    }
	 
	public void addFilterCondition(String filter) {
		if (this.where == null ) {
			this.where = new StringBuffer();
		}
		if (this.where.length() > 0) {
			this.where.append(" and ");
		}
		this.where.append(filter);
	}

	
	private void bindFilterParams(Query q) {

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
	
	
	public Query createQuery() throws Exception {
		Query q = this.em.createQuery(this.buildQueryStatement());
		bindFilterParams(q);
		return q;
	}
	
}
