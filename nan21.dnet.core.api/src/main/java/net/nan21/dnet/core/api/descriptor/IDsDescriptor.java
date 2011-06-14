package net.nan21.dnet.core.api.descriptor;

import java.util.Map;

public interface IDsDescriptor {
	
	public Map<String, String> getRefPaths();
	
	public Class<?> getDsClass();
	/*
	public String getParamClassName();
	public void setParamClassName(String paramClassName);
	
	public String getConverterClassName() ;
	public void setConverterClassName(String converterClassName) ;
	
	public String getServiceClassName() ;
	public void setServiceClassName(String serviceClassName);
	*/
}
