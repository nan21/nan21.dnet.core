package net.nan21.dnet.core.api.session;

import java.io.Serializable;
import java.util.List;

public class UserProfile implements Serializable {

	private static final long serialVersionUID = -7951956639299795918L;

	private final Boolean administrator;
	private final List<String> roles;

	public UserProfile(boolean administrator, List<String> roles) {
		super();
		this.administrator = administrator;
		this.roles = roles;
	}

	public Boolean isAdministrator() {
		return administrator;
	}

	public List<String> getRoles() {
		return roles;
	}

}
