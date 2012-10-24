package net.nan21.dnet.core.presenter.model;

import net.nan21.dnet.core.presenter.service.AbstractPresenterBaseService;

public class RpcDefinition {

	private final Class<? extends AbstractPresenterBaseService> delegateClass;
	private final String methodName;
	private boolean reloadFromEntity;

	public RpcDefinition(
			Class<? extends AbstractPresenterBaseService> delegateClass,
			String methodName) {
		super();
		this.delegateClass = delegateClass;
		this.methodName = methodName;
	}

	public RpcDefinition(
			Class<? extends AbstractPresenterBaseService> delegateClass,
			String methodName, boolean reloadFromEntity) {
		super();
		this.delegateClass = delegateClass;
		this.methodName = methodName;
		this.reloadFromEntity = reloadFromEntity;
	}

	public Class<? extends AbstractPresenterBaseService> getDelegateClass() {
		return delegateClass;
	}

	public String getMethodName() {
		return methodName;
	}

	public boolean getReloadFromEntity() {
		return this.reloadFromEntity;
	}

}