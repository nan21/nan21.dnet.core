package net.nan21.dnet.core.api;

import java.util.Map;

/**
 * @see {@link SystemConfig}
 * @author amathe
 *
 */
public interface ISystemConfig {

	public boolean isDisableFetchGroups() ;

	public String getWorkingMode();
	
	public boolean shouldCacheDescriptor();
	  
	public void addSysParam(String client, String paramName, String paramValue);
	
	public String getSysParamValue(String paramName) throws Exception;
	
	public void setSysParamValue(String paramName, String paramValue);
	
	public Map<String, String> getSysParams() throws Exception ;
	
	public void reloadSysparams() throws Exception;
	
	public String getPortalClientCode();
	
	public void setPortalClientCode(String portalClientCode);
	
	public String getPortalClientId() ;

	public void setPortalClientId(String portalClientId) ;

	
}
