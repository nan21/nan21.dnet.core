package net.nan21.dnet.core.api.descriptor;

public interface IDsDescriptor {
	
	public String getName();
	public void setName(String name);
	
	public String getModelClassName();
	public void setModelClassName(String modelClassName);
	
	public String getParamClassName();
	public void setParamClassName(String paramClassName);
	
	public String getConverterClassName() ;
	public void setConverterClassName(String converterClassName) ;
	
	public String getServiceClassName() ;
	public void setServiceClassName(String serviceClassName);
 
}
