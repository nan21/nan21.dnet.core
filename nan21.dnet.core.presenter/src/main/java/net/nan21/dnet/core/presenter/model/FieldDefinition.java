package net.nan21.dnet.core.presenter.model;

public class FieldDefinition {

	private String name;
	private String className;

	public FieldDefinition() {
		super();
	}

	public FieldDefinition(String name, String className) {
		super();
		this.name = name;
		this.className = className;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

}
