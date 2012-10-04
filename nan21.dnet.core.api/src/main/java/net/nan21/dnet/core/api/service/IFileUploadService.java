package net.nan21.dnet.core.api.service;

import java.io.InputStream;
import java.util.Map;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.action.IFileUploadResult;
import net.nan21.dnet.core.api.model.IUploadedFileDescriptor;

public interface IFileUploadService {

	public IFileUploadResult execute(IUploadedFileDescriptor fileDescriptor,
			InputStream inputStream, Map<String,String> uploadParams) throws Exception;

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
