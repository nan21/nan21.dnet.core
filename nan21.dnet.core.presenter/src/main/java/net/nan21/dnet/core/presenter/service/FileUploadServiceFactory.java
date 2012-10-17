package net.nan21.dnet.core.presenter.service;

import net.nan21.dnet.core.api.service.IFileUploadService;
import net.nan21.dnet.core.api.service.IFileUploadServiceFactory;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class FileUploadServiceFactory implements IFileUploadServiceFactory,
		ApplicationContextAware {

	private ApplicationContext applicationContext;

	@Override
	public IFileUploadService create(String key) {
		IFileUploadService s = (IFileUploadService) this.applicationContext
				.getBean(key);
		return s;
	}

	public ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	public void setApplicationContext(ApplicationContext applicationContext) {
		this.applicationContext = applicationContext;
	}

}
