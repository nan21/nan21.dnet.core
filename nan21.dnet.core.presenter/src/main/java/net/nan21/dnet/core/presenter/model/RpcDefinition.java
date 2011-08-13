package net.nan21.dnet.core.presenter.model;

import net.nan21.dnet.core.presenter.service.AbstractDsDelegate;

public class RpcDefinition {
	
	private final Class<? extends AbstractDsDelegate> delegateClass;
	private final String methodName;
	
	
	public RpcDefinition(Class<? extends AbstractDsDelegate> delegateClass,
			String methodName) {
		super();
		this.delegateClass = delegateClass;
		this.methodName = methodName;
	}
	
	public Class<? extends AbstractDsDelegate> getDelegateClass() {
		return delegateClass;
	}
	public String getMethodName() {
		return methodName;
	}
	
	
	
}
