package net.nan21.dnet.core.presenter.service;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class AbstractApplicationContextAware implements ApplicationContextAware {

	private ApplicationContext applicationContext;

	public ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	public void setApplicationContext(ApplicationContext applicationContext) {
		this.applicationContext = applicationContext;
	}
}
