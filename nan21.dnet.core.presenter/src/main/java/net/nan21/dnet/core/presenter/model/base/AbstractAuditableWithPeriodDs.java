package net.nan21.dnet.core.presenter.model.base;

import java.util.Date;

import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;

public class AbstractAuditableWithPeriodDs<E> extends AbstractDsModel<E>
		implements IModelWithId, IModelWithClientId {

	public static final String f_id = "id";
	public static final String f_uuid = "uuid";
	public static final String f_clientId = "clientId";
	public static final String f_createdAt = "createdAt";
	public static final String f_modifiedAt = "modifiedAt";
	public static final String f_createdBy = "createdBy";
	public static final String f_modifiedBy = "modifiedBy";
	public static final String f_version = "version";
	public static final String f_entityFQN = "entityFQN";
	public static final String f_startDate = "startDate";
	public static final String f_endDate = "endDate";

	@DsField(noUpdate = true)
	protected Long id;

	@DsField()
	protected Date startDate;

	@DsField()
	protected Date endDate;

	@DsField(noUpdate = true)
	protected String uuid;

	@DsField(noUpdate = true)
	protected Long clientId;

	@DsField(noUpdate = true)
	protected Date createdAt;

	@DsField(noUpdate = true)
	protected Date modifiedAt;

	@DsField(noUpdate = true)
	protected String createdBy;

	@DsField(noUpdate = true)
	protected String modifiedBy;

	@DsField()
	protected Long version;

	@DsField(noUpdate = true, fetch = false, path = "className")
	protected String entityFQN;

	public AbstractAuditableWithPeriodDs() {
		super();
	}

	public AbstractAuditableWithPeriodDs(E e) {
		super(e);
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Object id) {
		this.id = this._asLong_(id);

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

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public Long getClientId() {
		return this.clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Date getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getModifiedAt() {
		return this.modifiedAt;
	}

	public void setModifiedAt(Date modifiedAt) {
		this.modifiedAt = modifiedAt;
	}

	public String getCreatedBy() {
		return this.createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getModifiedBy() {
		return this.modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public Long getVersion() {
		return this.version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public String getEntityFQN() {
		return this.entityFQN;
	}

	public void setEntityFQN(String entityFQN) {
		this.entityFQN = entityFQN;
	}

}