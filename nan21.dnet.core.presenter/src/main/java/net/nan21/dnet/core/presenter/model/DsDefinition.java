package net.nan21.dnet.core.presenter.model;

import net.nan21.dnet.core.api.descriptor.IDsDefinition;

public class DsDefinition implements IDsDefinition {
	
	private String name;
	private Class<?> modelClass;
 
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Class<?> getModelClass() {
		return modelClass;
	}
	public void setModelClass(Class<?> modelClass) {
		this.modelClass = modelClass;
	}
}
