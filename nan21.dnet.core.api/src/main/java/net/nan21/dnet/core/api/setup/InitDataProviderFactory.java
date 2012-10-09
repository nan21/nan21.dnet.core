package net.nan21.dnet.core.api.setup;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class InitDataProviderFactory implements IInitDataProviderFactory,
		ApplicationContextAware {

	private ApplicationContext applicationContext;

	private String name;

	public IInitDataProvider createProvider() {
		return (IInitDataProvider) applicationContext
				.getBean(InitDataProvider.class);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	public void setApplicationContext(ApplicationContext applicationContext) {
		this.applicationContext = applicationContext;
	}

}
