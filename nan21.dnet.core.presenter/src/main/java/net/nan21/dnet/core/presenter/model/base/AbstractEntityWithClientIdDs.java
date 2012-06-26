package net.nan21.dnet.core.presenter.model.base;

import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;

public class AbstractEntityWithClientIdDs<E> extends AbstractDsModel<E>
		implements IModelWithClientId {

	public static final String fCLIENTID = "clientId";

	@DsField(noUpdate = true)
	protected Long clientId;

	@DsField(noUpdate = true, fetch = false, path = "className")
	protected String entityFQN;

	public AbstractEntityWithClientIdDs() {
		super();
	}

	public AbstractEntityWithClientIdDs(E e) {
		super(e);
	}

	public Long getClientId() {
		return this.clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public String getEntityFQN() {
		return this.entityFQN;
	}

	public void setEntityFQN(String entityFQN) {
		this.entityFQN = entityFQN;
	}

}
