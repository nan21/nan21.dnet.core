package net.nan21.dnet.core.presenter.model;

import net.nan21.dnet.core.presenter.service.AbstractDsDelegate;

public class RpcDefinition {

	private final Class<? extends AbstractDsDelegate> delegateClass;
	private final String methodName;
	private boolean reloadFromEntity;

	public RpcDefinition(Class<? extends AbstractDsDelegate> delegateClass,
			String methodName) {
		super();
		this.delegateClass = delegateClass;
		this.methodName = methodName;
	}

	public RpcDefinition(Class<? extends AbstractDsDelegate> delegateClass,
			String methodName, boolean reloadFromEntity) {
		super();
		this.delegateClass = delegateClass;
		this.methodName = methodName;
		this.reloadFromEntity = reloadFromEntity;
	}

	public Class<? extends AbstractDsDelegate> getDelegateClass() {
		return delegateClass;
	}

	public String getMethodName() {
		return methodName;
	}

	public boolean getReloadFromEntity() {
		return this.reloadFromEntity;
	}

}