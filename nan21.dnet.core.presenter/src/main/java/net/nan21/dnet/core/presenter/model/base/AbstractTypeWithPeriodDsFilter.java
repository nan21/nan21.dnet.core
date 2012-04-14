package net.nan21.dnet.core.presenter.model.base;

import java.util.Date;

import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.presenter.model.AbstractDsFilter;

public class AbstractTypeWithPeriodDsFilter extends AbstractDsFilter implements
		IModelWithId, IModelWithClientId {

	protected String name;

	protected Date startDate;

	protected Date endDate;

	protected Boolean active;

	protected String notes;

	protected Long id;

	protected String uuid;

	protected Long clientId;

	protected Date createdAt;

	protected Date createdAt_From;
	protected Date createdAt_To;

	protected Date modifiedAt;

	protected Date modifiedAt_From;
	protected Date modifiedAt_To;

	protected String createdBy;

	protected String modifiedBy;

	public AbstractTypeWithPeriodDsFilter() {
		super();
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

	public Date getCreatedAt_From() {
		return createdAt_From;
	}

	public void setCreatedAt_From(Date createdAtFrom) {
		createdAt_From = createdAtFrom;
	}

	public Date getCreatedAt_To() {
		return createdAt_To;
	}

	public void setCreatedAt_To(Date createdAtTo) {
		createdAt_To = createdAtTo;
	}

	public Date getModifiedAt_From() {
		return modifiedAt_From;
	}

	public void setModifiedAt_From(Date modifiedAtFrom) {
		modifiedAt_From = modifiedAtFrom;
	}

	public Date getModifiedAt_To() {
		return modifiedAt_To;
	}

	public void setModifiedAt_To(Date modifiedAtTo) {
		modifiedAt_To = modifiedAtTo;
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

}
