package net.nan21.dnet.core.presenter.model.base;

import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.presenter.model.AbstractDsFilter;

public class AbstractEntityWithClientIdDsFilter extends AbstractDsFilter
		implements IModelWithClientId {

	protected Long clientId;

	public AbstractEntityWithClientIdDsFilter() {
		super();
	}

	public Long getClientId() {
		return this.clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

}
