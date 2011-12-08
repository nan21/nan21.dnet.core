package net.nan21.dnet.core.api;

/**
 * @see {@link SystemConfig}
 * @author amathe
 *
 */
public interface ISystemConfig {

	public boolean isDisableFetchGroups() ;

	public String getWorkingMode();
	
	public boolean shouldCacheDescriptor();
	
}
