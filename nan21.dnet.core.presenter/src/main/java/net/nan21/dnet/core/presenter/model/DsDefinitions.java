package net.nan21.dnet.core.presenter.model;

import java.util.Collection;

import net.nan21.dnet.core.api.descriptor.IDsDefinition;
import net.nan21.dnet.core.api.descriptor.IDsDefinitions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class DsDefinitions implements IDsDefinitions {
	
	@Autowired
	protected ApplicationContext appContext;
	
	@Override
	public Collection<IDsDefinition> getDsDefinitions() {
		return appContext.getBeansOfType(IDsDefinition.class).values();
	}
	 
	public ApplicationContext getAppContext() {
		return appContext;
	}

	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}
	 
}
