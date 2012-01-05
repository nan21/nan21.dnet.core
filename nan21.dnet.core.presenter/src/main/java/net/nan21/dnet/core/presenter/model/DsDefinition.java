package net.nan21.dnet.core.presenter.model;

import net.nan21.dnet.core.api.descriptor.IDsDefinition;

public class DsDefinition implements IDsDefinition {

	/**
	 * Business name of the data-source component used to identify the component
	 * when serving a request.
	 */
	private String name;

	/**
	 * Data-source model class.
	 */
	private Class<?> modelClass;

	/**
	 * Flag which indicates that this is an assignment component.
	 */
	private boolean asgn;

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

	public boolean isAsgn() {
		return asgn;
	}

	public void setAsgn(boolean isAsgn) {
		this.asgn = isAsgn;
	}

}
