package net.nan21.dnet.core.presenter.model.base;

import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.presenter.model.AbstractDsFilter;

public class AbstractSimpleDsFilter extends AbstractDsFilter implements
		IModelWithId, IModelWithClientId {

	protected Long id;

	protected Long clientId;

	 

	public AbstractSimpleDsFilter() {
		super();
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
