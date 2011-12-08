package net.nan21.dnet.core.api.service;

import net.nan21.dnet.core.api.ISystemConfig;
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
	public ISystemConfig getSystemConfig();

	/**
	 * Setter for system configuration.
	 * 
	 * @param systemConfig
	 */
	public void setSystemConfig(ISystemConfig systemConfig);
}
