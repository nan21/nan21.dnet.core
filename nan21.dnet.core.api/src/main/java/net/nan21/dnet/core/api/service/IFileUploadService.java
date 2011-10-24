package net.nan21.dnet.core.api.service;

import net.nan21.dnet.core.api.SystemConfig;
import net.nan21.dnet.core.api.action.IFileUploadResult;
import org.springframework.web.multipart.MultipartFile;

public interface IFileUploadService {
	
	public IFileUploadResult execute(String name, MultipartFile file, String p1, String p2)
		throws Exception;
	
	/**
	 * Getter for system configuration.
	 * 
	 * @return
	 */
	public SystemConfig getSystemConfig();

	/**
	 * Setter for system configuration.
	 * 
	 * @param systemConfig
	 */
	public void setSystemConfig(SystemConfig systemConfig);
}
