package net.nan21.dnet.core.api.setup;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class InitDataProviderFactory implements IInitDataProviderFactory {

	@Autowired
	private ApplicationContext appContext;

	private String name;

	public IInitDataProvider createProvider() {
		return (IInitDataProvider) appContext
				.getBean(InitDataProvider.class);
	}

	public ApplicationContext getAppContext() {
		return appContext;
	}

	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
