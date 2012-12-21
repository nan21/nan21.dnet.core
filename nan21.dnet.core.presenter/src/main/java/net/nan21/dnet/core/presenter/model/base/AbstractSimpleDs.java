package net.nan21.dnet.core.presenter.model.base;

import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;

public class AbstractSimpleDs<E> extends AbstractDsModel<E> implements
		IModelWithId, IModelWithClientId {

	public static final String f_id = "id";
	public static final String f_clientId = "clientId";
	public static final String f_entityFQN = "entityFQN";

	@DsField(noUpdate = true)
	protected Long id;

	@DsField(noUpdate = true)
	protected Long clientId;

	@DsField(noUpdate = true, fetch = false, path = "className")
	protected String entityFQN;

	public AbstractSimpleDs() {
		super();
	}

	public AbstractSimpleDs(E e) {
		super(e);
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Object id) {
		this.id = this._asLong_(id);

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
