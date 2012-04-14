package net.nan21.dnet.core.presenter.model.base;

import java.util.Date;

import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;

public class AbstractTypeWithPeriodLov<E> extends AbstractDsModel<E> implements
		IModelWithId, IModelWithClientId {

	public static final String fID = "id";
	public static final String fCLIENTID = "clientId";
	public static final String fNAME = "name";
	public static final String fSTARTDATE = "startDate";
	public static final String fENDDATE = "endDate";
	public static final String fACTIVE = "active";

	@DsField()
	protected Long id;

	@DsField()
	protected Long clientId;

	@DsField()
	protected String name;

	@DsField()
	protected Date startDate;

	@DsField()
	protected Date endDate;

	@DsField()
	protected Boolean active;

	public AbstractTypeWithPeriodLov() {
		super();
	}

	public AbstractTypeWithPeriodLov(E e) {
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

	public Date getStartDate() {
		return this.startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return this.endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Boolean getActive() {
		return this.active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

}
