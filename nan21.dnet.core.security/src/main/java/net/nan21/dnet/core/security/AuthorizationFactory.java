package net.nan21.dnet.core.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import net.nan21.dnet.core.api.security.IAuthorization;
import net.nan21.dnet.core.api.security.IAuthorizationFactory;

public class AuthorizationFactory implements
		IAuthorizationFactory {

	@Autowired
	private ApplicationContext appContext;

	@Override
	public IAuthorization getAsgnAuthorizationProvider() {
		return (IAuthorization) this.appContext
				.getBean(AuthorizationForAsgn.class);
	}

	@Override
	public IAuthorization getDsAuthorizationProvider() {
		return (IAuthorization) this.appContext
				.getBean(AuthorizationForDs.class);
	}

	@Override
	public IAuthorization getJobAuthorizationProvider() {
		return (IAuthorization) this.appContext
				.getBean(AuthorizationForJob.class);
	}

	public ApplicationContext getAppContext() {
		return appContext;
	}

	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

}
