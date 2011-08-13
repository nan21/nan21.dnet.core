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
	private Map<String, String> refPaths;
	
	private boolean worksWithJpql = true;
	private String jpqlDefaultWhere; 
	private String jpqlDefaultSort;
	
	public AbstractViewModelDescriptor() {		
	}
	
	public AbstractViewModelDescriptor(Class<M> modelClass) {
		this.modelClass = modelClass;
		this.buildRefPaths();
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
						sb.append( sf[i].field() + "" + ((sf[i].desc())? " desc": ""  ));
					}
				}
				this.jpqlDefaultSort = sb.toString();
			} else {
				this.jpqlDefaultSort = this.modelClass.getAnnotation(Ds.class).jpqlSort();
			}
			
			
		}
	}
	
	protected void buildRefPaths() {
		if (this.refPaths == null) {
			this.refPaths = new HashMap<String, String>();
			Field[] fields = this.modelClass.getDeclaredFields();
			for (Field field : fields) {
				if(field.isAnnotationPresent(DsField.class)) {					 
					String path = field.getAnnotation(DsField.class).path();
					if (path.equals("")) {
						path = field.getName();
					}
					this.refPaths.put(field.getName(), path);					 			
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
	
	 
	
	
}
