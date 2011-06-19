package net.nan21.dnet.core.presenter.model;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
 
import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.api.descriptor.IDsDescriptor;
 

public class DsDescriptor<M> implements IDsDescriptor {

	private Class<M> dsClass;
	private String name;
	private Map<String, String> refPaths;
	 
	public DsDescriptor(Class<M> dsClass) {
		this.dsClass = dsClass;
		this.buildRefPaths();
	}
	
	public Class<M> getDsClass() {
		return dsClass;
	}
	  
	public Map<String, String> getRefPaths() {
		return refPaths;
	}

	private void buildRefPaths() {
		if (this.refPaths == null) {
			this.refPaths = new HashMap<String, String>();
			Field[] fields = this.dsClass.getDeclaredFields();
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
