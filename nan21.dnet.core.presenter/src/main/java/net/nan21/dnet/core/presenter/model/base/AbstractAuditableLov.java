package net.nan21.dnet.core.presenter.model.base;

import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;

public class AbstractAuditableLov<E> extends AbstractDsModel<E> implements
		IModelWithId, IModelWithClientId {

	public static final String f_id = "id";
	public static final String f_clientId = "clientId";

	@DsField()
	protected Long id;

	@DsField()
	protected Long clientId;

	public AbstractAuditableLov() {
		super();
	}

	public AbstractAuditableLov(E e) {
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

}
