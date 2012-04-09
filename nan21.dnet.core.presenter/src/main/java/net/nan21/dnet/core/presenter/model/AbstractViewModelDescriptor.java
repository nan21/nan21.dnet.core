package net.nan21.dnet.core.presenter.model;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.QueryHint;

import org.eclipse.persistence.config.QueryHints;

import net.nan21.dnet.core.api.annotation.Ds;
import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.api.annotation.DsQueryHints;
import net.nan21.dnet.core.api.annotation.SortField;
import net.nan21.dnet.core.api.descriptor.IViewModelDescriptor;

public abstract class AbstractViewModelDescriptor<M> implements IViewModelDescriptor<M> {
	
	private Class<M> modelClass;
	
	/**
	 * Holds the mapping from a data-source field to the corresponding entity property as a navigation path expression.
	 * Used by the base converter to populate the view model instances from the source entity.
	 * Example: dsFieldName => entityField or dsFieldName => entityRefField.entityRefField.entityAttribute
	 */
	private Map<String, String> refPaths;
	/**
	 * Holds the reversed mapping only for the root entity attributes.
	 * Used in the base converter to update the root entity attributes from the view model instance.
	 * Example: entityField => dsFieldName.
	 */
	private Map<String, String> m2eConv;
	
	private Map<String, String> e2mConv;
	
	private Map<String, String> jpqlFieldFilterRules;
	
	private Map<String, String> fetchJoins;
	
	private List<String> noInserts;
	
	private List<String> noUpdates;
	//private Map<String, String> nestedFetchJoins;
	
	private Map<String, String[]> orderBys;
	
	private Map<String, Object> queryHints;
	
	private boolean worksWithJpql = true;
	private String jpqlDefaultWhere; 
	private String jpqlDefaultSort;
	
	public AbstractViewModelDescriptor() {		
	}
	
	public AbstractViewModelDescriptor(Class<M> modelClass) {
		this.modelClass = modelClass;
		this.buildElements();
		this.buildHeaders();
	}
	
	/**
	 * Process model level annotations
	 */
	protected void buildHeaders () {
		if (this.modelClass.isAnnotationPresent(Ds.class)) {
			this.jpqlDefaultWhere = this.modelClass.getAnnotation(Ds.class).jpqlWhere();
			SortField[] sf = this.modelClass.getAnnotation(Ds.class).sort();
			if (sf != null && sf.length > 0) {
				StringBuffer sb = new StringBuffer();
				for (int i=0, len = sf.length; i<len ; i++) {
					if (i>0) {
						sb.append(",");
					}
					sb.append("e."+this.refPaths.get( sf[i].field()) + "" + ((sf[i].desc())? " desc": ""  ));
				}
				this.jpqlDefaultSort = sb.toString();
			} else {
				this.jpqlDefaultSort = this.modelClass.getAnnotation(Ds.class).jpqlSort();
			}
			// query hints
			if (this.modelClass.isAnnotationPresent(DsQueryHints.class)) {
				queryHints = new HashMap<String, Object>();
				QueryHint[] hints = this.modelClass.getAnnotation(DsQueryHints.class).value();
				for( int i=0, len = hints.length; i<len ; i++) {
					queryHints.put(hints[i].name(), hints[i].value());
				}				
			}
			
		}
	}
	
	/**
	 * Process field annotations
	 */
	protected void buildElements() {
		if (this.refPaths == null) {
			this.refPaths = new HashMap<String, String>();
			this.m2eConv = new HashMap<String, String>();
			this.e2mConv = new HashMap<String, String>();
			
			this.noInserts = new ArrayList<String>();
			this.noUpdates = new ArrayList<String>();
			 
			this.jpqlFieldFilterRules = new HashMap<String, String>();
			this.fetchJoins = new HashMap<String, String>();
			this.orderBys = new HashMap<String, String[]>();
			
			boolean createHintsForNestedFetchJoins = false;
			if (queryHints == null) {
				queryHints = new HashMap<String, Object>();
			}
			//this.nestedFetchJoins = new HashMap<String, String>();
			Field[] fields = this.modelClass.getDeclaredFields();
			for (Field field : fields) {
				if(field.isAnnotationPresent(DsField.class)) {
					String fieldName = field.getName();
					
					if (field.getAnnotation(DsField.class).noInsert()) {
						this.noInserts.add(fieldName);
					}
					if (field.getAnnotation(DsField.class).noUpdate()) {
						this.noUpdates.add(fieldName);
					}
					String path = field.getAnnotation(DsField.class).path();
					if (path.equals("")) {
						path = field.getName();
					}
					
					String orderBy = field.getAnnotation(DsField.class).orderBy();
					if (!orderBy.equals("")) {
						String[] orderByFields = orderBy.split(",");
						String[] orderBys = new String[orderByFields.length] ;
						String prefix = path.substring(0, path.lastIndexOf("."));
						for (int y=0,l=orderByFields.length; y<l;y++) {
							if (prefix != null && !prefix.equals("")) {
								orderBys[y] = prefix + "."+ orderByFields[y];
							} else {
								orderBys[y] = orderByFields[y];
							}
						}
						this.orderBys.put(fieldName, orderBys);
					}
					
					this.e2mConv.put(fieldName, path);
					if (field.getAnnotation(DsField.class).fetch()) {
						this.refPaths.put(fieldName, path);
						int firstDot = path.indexOf(".");
						if (firstDot > 0) {
							if (firstDot == path.lastIndexOf(".")) {
								this.fetchJoins.put("e."+path.substring(0, path.lastIndexOf(".")), field.getAnnotation(DsField.class).join());
							} else {
								if (createHintsForNestedFetchJoins) {
									String p = "e."+path.substring(0, path.lastIndexOf("."));
									String type = field.getAnnotation(DsField.class).join();
									if (type != null && type.equals("left")) {
										this.queryHints.put(QueryHints.LEFT_FETCH, p);										 
									} else {
										this.queryHints.put(QueryHints.FETCH, p);										 
									}									
								}
 
							}						
						} else {
							this.m2eConv.put(path, fieldName);
						}
					}					
					String jpqlFieldFilterRule = field.getAnnotation(DsField.class).jpqlFilter();
					if(jpqlFieldFilterRule!=null && !"".equals(jpqlFieldFilterRule)) {
						this.jpqlFieldFilterRules.put(fieldName, jpqlFieldFilterRule);
					}					 
				}
			}		 
		}
	}

	// ---------------- getters - setters -------------------
	
	
	public Class<M> getModelClass() {
		return modelClass;
	}

	public void setModelClass(Class<M> modelClass) {
		this.modelClass = modelClass;
	}

	public Map<String, String> getRefPaths() {
		return refPaths;
	}

	public boolean isWorksWithJpql() {
		return worksWithJpql;
	}

	public String getJpqlDefaultWhere() {
		return jpqlDefaultWhere;
	}

	public String getJpqlDefaultSort() {
		return jpqlDefaultSort;
	}

	public Map<String, String> getJpqlFieldFilterRules() {
		return jpqlFieldFilterRules;
	}

	public Map<String, String> getFetchJoins() {
		return fetchJoins;
	}

//	public Map<String, String> getNestedFetchJoins() {
//		return nestedFetchJoins;
//	}

	public Map<String, String> getM2eConv() {
		return m2eConv;
	}

	public Map<String, Object> getQueryHints() {
		return queryHints;
	}

	public Map<String, String> getE2mConv() {
		return e2mConv;
	}

	public List<String> getNoInserts() {
		return noInserts;
	}

	public List<String> getNoUpdates() {
		return noUpdates;
	}

	public Map<String, String[]> getOrderBys() {
		return orderBys;
	}
	 
	
}
