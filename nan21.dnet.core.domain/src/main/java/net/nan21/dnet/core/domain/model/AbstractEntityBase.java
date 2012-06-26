package net.nan21.dnet.core.domain.model;

import net.nan21.dnet.core.api.session.Session;

public class AbstractEntityBase {
	protected void __validate_client_context__(Long clientId) {
		if (clientId != null && clientId != Session.user.get().getClientId()) {
			throw new RuntimeException(
					"Client conflict detected. You are trying to work with an entity which belongs to client with id=`"
							+ clientId
							+ "` but the current session is connected to client with id=`"
							+ Session.user.get().getClientId() + "` ");
		}
	}
}
