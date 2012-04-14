package net.nan21.dnet.core.presenter.model.base;

import java.util.Date;

import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;

public class AbstractTypeWithPeriodDs<E> extends AbstractDsModel<E> {

	public static final String fNAME = "name";
	public static final String fSTARTDATE = "startDate";
	public static final String fENDDATE = "endDate";
	public static final String fACTIVE = "active";
	public static final String fNOTES = "notes";
	public static final String fID = "id";
	public static final String fUUID = "uuid";
	public static final String fCLIENTID = "clientId";
	public static final String fCREATEDAT = "createdAt";
	public static final String fMODIFIEDAT = "modifiedAt";
	public static final String fCREATEDBY = "createdBy";
	public static final String fMODIFIEDBY = "modifiedBy";
	public static final String fVERSION = "version";
	public static final String fENTITYFQN = "entityFQN";

	@DsField()
	protected String name;

	@DsField()
	protected Date startDate;

	@DsField()
	protected Date endDate;

	@DsField()
	protected Boolean active;

	@DsField()
	protected String notes;

	@DsField(noUpdate = true)
	protected Long id;

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

	public AbstractTypeWithPeriodDs() {
		super();
	}

	public AbstractTypeWithPeriodDs(E e) {
		super(e);
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

	public String getNotes() {
		return this.notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Object id) {
		this.id = this._asLong_(id);

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
