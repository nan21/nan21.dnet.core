package net.nan21.dnet.core.presenter.model.base;

import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;

public class AbstractAuditableNoTenantLov<E> extends AbstractDsModel<E>
		implements IModelWithId {

	public static final String f_id = "id";

	@DsField()
	protected Long id;

	public AbstractAuditableNoTenantLov() {
		super();
	}

	public AbstractAuditableNoTenantLov(E e) {
		super(e);
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Object id) {
		this.id = this._asLong_(id);

	}

}
