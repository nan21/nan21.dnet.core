package net.nan21.dnet.core.presenter.model;

import java.util.ArrayList;
import java.util.List;

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

	/**
	 * Flag which indicates that this components provides only read-only
	 * functionality.
	 */
	private boolean readOnly;

	/**
	 * List of publicly exposed service methods.
	 */
	private List<String> serviceMethods;

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

	public boolean isReadOnly() {
		return readOnly;
	}

	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	}

	public List<String> getServiceMethods() {
		return serviceMethods;
	}

	public void setServiceMethods(List<String> serviceMethods) {
		this.serviceMethods = serviceMethods;
	}

	public void addServiceMethod(String serviceMethod) {
		if (this.serviceMethods == null) {
			this.serviceMethods = new ArrayList<String>();
		}
		this.serviceMethods.add(serviceMethod);
	}
}
