package net.nan21.dnet.core.presenter.service;

import net.nan21.dnet.core.api.service.IFileUploadService;
import net.nan21.dnet.core.api.service.IFileUploadServiceFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class FileUploadServiceFactory implements IFileUploadServiceFactory {
	@Autowired
	private ApplicationContext appContext;

	@Override
	public IFileUploadService create(String key) {
		IFileUploadService s = (IFileUploadService)this.appContext.getBean(key);		 
		return s; 
	}
	
	public ApplicationContext getAppContext() {
		return appContext;
	}
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}
}
