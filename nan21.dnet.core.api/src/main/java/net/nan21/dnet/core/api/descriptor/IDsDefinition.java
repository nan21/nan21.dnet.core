package net.nan21.dnet.core.api.descriptor;

public interface IDsDefinition {
	public String getName();
	public void setName(String name);
	public Class<?> getModelClass();
	public void setModelClass(Class<?> modelClass);
}
