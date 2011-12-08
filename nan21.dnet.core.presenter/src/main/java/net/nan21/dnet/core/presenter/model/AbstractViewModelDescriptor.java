package net.nan21.dnet.core.presenter.model;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import net.nan21.dnet.core.api.annotation.Ds;
import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.api.annotation.SortField;
import net.nan21.dnet.core.api.descriptor.IViewModelDescriptor;

public class AbstractViewModelDescriptor<M> implements IViewModelDescriptor<M> {
	
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
	private Map<String, String> nestedFetchJoins;
	
	
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
	protected void buildHeaders () {
		if (this.modelClass.isAnnotationPresent(Ds.class)) {
			this.jpqlDefaultWhere = this.modelClass.getAnnotation(Ds.class).jpqlWhere();
			SortField[] sf = this.modelClass.getAnnotation(Ds.class).sort();
			if (sf != null && sf.length > 0) {
				StringBuffer sb = new StringBuffer();
				for (int i=0; i<sf.length; i++) {
					if (i>0) {
						sb.append(",");
					}
					sb.append("e."+this.refPaths.get( sf[i].field()) + "" + ((sf[i].desc())? " desc": ""  ));
				}
				this.jpqlDefaultSort = sb.toString();
			} else {
				this.jpqlDefaultSort = this.modelClass.getAnnotation(Ds.class).jpqlSort();
			}			 
		}
	}
	
	protected void buildElements() {
		if (this.refPaths == null) {
			this.refPaths = new HashMap<String, String>();
			this.m2eConv = new HashMap<String, String>();
			this.e2mConv = new HashMap<String, String>();
			this.jpqlFieldFilterRules = new HashMap<String, String>();
			this.fetchJoins = new HashMap<String, String>();
			this.nestedFetchJoins = new HashMap<String, String>();
			Field[] fields = this.modelClass.getDeclaredFields();
			for (Field field : fields) {
				if(field.isAnnotationPresent(DsField.class)) {					 
					String path = field.getAnnotation(DsField.class).path();
					if (path.equals("")) {
						path = field.getName();
					}
					this.e2mConv.put(field.getName(), path);
					if (field.getAnnotation(DsField.class).fetch()) {
						this.refPaths.put(field.getName(), path);
						int firstDot = path.indexOf(".");
						if (firstDot > 0) {
							if (firstDot == path.lastIndexOf(".")) {
								this.fetchJoins.put("e."+path.substring(0, path.lastIndexOf(".")), field.getAnnotation(DsField.class).join());
							} else {
								this.nestedFetchJoins.put("e."+path.substring(0, path.lastIndexOf(".")), field.getAnnotation(DsField.class).join());
							}						
						} else {
							this.m2eConv.put(path, field.getName());
						}
					}					
					String jpqlFieldFilterRule = field.getAnnotation(DsField.class).jpqlFilter();
					if(jpqlFieldFilterRule!=null && !"".equals(jpqlFieldFilterRule)) {
						this.jpqlFieldFilterRules.put(field.getName(), jpqlFieldFilterRule);
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

	public Map<String, String> getNestedFetchJoins() {
		return nestedFetchJoins;
	}

	public Map<String, String> getM2eConv() {
		return m2eConv;
	}

	public Map<String, String> getE2mConv() {
		return e2mConv;
	}
	 
	
}
