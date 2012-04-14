package net.nan21.dnet.core.presenter.model.base;

import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;

public class AbstractTypeLov<E> extends AbstractDsModel<E> implements
		IModelWithId, IModelWithClientId {

	public static final String fID = "id";
	public static final String fCLIENTID = "clientId";
	public static final String fNAME = "name";
	public static final String fACTIVE = "active";

	@DsField()
	protected Long id;

	@DsField()
	protected Long clientId;

	@DsField()
	protected String name;

	@DsField()
	protected Boolean active;

	public AbstractTypeLov() {
		super();
	}

	public AbstractTypeLov(E e) {
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

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getActive() {
		return this.active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

}
