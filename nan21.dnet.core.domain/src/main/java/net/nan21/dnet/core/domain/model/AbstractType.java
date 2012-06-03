package net.nan21.dnet.core.domain.model;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;

import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.api.session.Session;

import org.eclipse.persistence.descriptors.DescriptorEvent;
import org.hibernate.validator.constraints.NotBlank;

@MappedSuperclass
public abstract class AbstractType extends AbstractEntityWithClientId implements Serializable, IModelWithId,
		IModelWithClientId {

	private static final long serialVersionUID = -1L;

	/**
	 * Name of entity.
	 */
	@Column(name = "NAME", nullable = false, length = 255)
	@NotBlank
	protected String name;

	/**
	 * Flag which indicates if this record is actively used.
	 */
	@Column(name = "ACTIVE", nullable = false)
	@NotNull
	protected Boolean active;

	/**
	 * Description of entity.
	 */
	@Column(name = "DESCRIPTION", length = 400)
	protected String description;

	/** Owner client */
	@Column(name = "CLIENTID", nullable = false)
	@NotNull
	protected Long clientId;

	/** Timestamp when this record was created. */
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "CREATEDAT", nullable = false)
	@NotNull
	protected Date createdAt;

	/** Timestamp when this record was last modified. */
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "MODIFIEDAT", nullable = false)
	@NotNull
	protected Date modifiedAt;

	/** User who created this record. */
	@Column(name = "CREATEDBY", nullable = false, length = 32)
	@NotBlank
	protected String createdBy;

	/** User who last modified this record. */
	@Column(name = "MODIFIEDBY", nullable = false, length = 32)
	@NotBlank
	protected String modifiedBy;

	@Version
	/** Record version number used by the persistence framework. */
	@Column(name = "VERSION", nullable = false)
	@NotNull
	protected Long version;

	/**
	 * System generated UID. Useful for data import-export and data-replication
	 */
	@Column(name = "UUID", length = 36)
	protected String uuid;

	@Transient
	public String getClassName() {
		return this.getClass().getCanonicalName();
	}

	public abstract Long getId();

	public abstract void setId(Long id);

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

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getModifiedAt() {
		return modifiedAt;
	}

	public void setModifiedAt(Date modifiedAt) {
		this.modifiedAt = modifiedAt;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public void aboutToInsert(DescriptorEvent event) {

		event.updateAttributeWithObject("createdAt", new Date());
		event.updateAttributeWithObject("modifiedAt", new Date());
		event.updateAttributeWithObject("createdBy", Session.user.get()
				.getUsername());
		event.updateAttributeWithObject("modifiedBy", Session.user.get()
				.getUsername());
		event.updateAttributeWithObject("clientId", Session.user.get()
				.getClientId());
		if (this.uuid == null || this.uuid.equals("")) {
			event.updateAttributeWithObject("uuid", UUID.randomUUID()
					.toString().toUpperCase());
		}
		if (this.active == null) {
			event.updateAttributeWithObject("active", false);
		}
	}

	public void aboutToUpdate(DescriptorEvent event) {
		this.__validate_client_context__(this.clientId);
		event.updateAttributeWithObject("modifiedAt", new Date());
		event.updateAttributeWithObject("modifiedBy", Session.user.get()
				.getUsername());

	}
}
