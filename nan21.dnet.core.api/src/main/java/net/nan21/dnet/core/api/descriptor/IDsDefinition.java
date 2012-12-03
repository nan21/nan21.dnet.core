package net.nan21.dnet.core.api.descriptor;

import java.util.List;

public interface IDsDefinition {

	public String getName();

	public void setName(String name);

	public Class<?> getModelClass();

	public void setModelClass(Class<?> modelClass);

	public boolean isAsgn();

	public boolean isReadOnly();

	public void setAsgn(boolean isAsgn);

	public void addServiceMethod(String serviceMethod);

	public List<String> getServiceMethods();

}
