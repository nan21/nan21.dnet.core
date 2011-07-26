package net.nan21.dnet.core.presenter.model;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.api.descriptor.IViewModelDescriptor;

public class AbstractViewModelDescriptor<M> implements IViewModelDescriptor<M> {
	
	private Class<M> modelClass;	 
	private Map<String, String> refPaths;
	
	public AbstractViewModelDescriptor() {		
	}
	
	public AbstractViewModelDescriptor(Class<M> modelClass) {
		this.modelClass = modelClass;
		this.buildRefPaths();
	}
	
	public Class<M> getModelClass() {
		return modelClass;
	}

	public void setModelClass(Class<M> modelClass) {
		this.modelClass = modelClass;
	}

	public Map<String, String> getRefPaths() {
		return refPaths;
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
	
}
