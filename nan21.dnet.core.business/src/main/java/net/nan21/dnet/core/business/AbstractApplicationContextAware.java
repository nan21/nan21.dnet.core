package net.nan21.dnet.core.business;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public abstract class AbstractApplicationContextAware implements
		ApplicationContextAware {

	private ApplicationContext applicationContext;

	public ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	public void setApplicationContext(ApplicationContext applicationContext) {
		this.applicationContext = applicationContext;
	}

}
