package net.nan21.dnet.core.domain.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;

import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.api.session.Session;

import org.eclipse.persistence.descriptors.DescriptorEvent;

@MappedSuperclass
public abstract class AbstractSimpleEntity extends AbstractEntityWithClientId implements Serializable,
		IModelWithId, IModelWithClientId {

	private static final long serialVersionUID = -1L;

	/** Owner client */
	@Column(name = "CLIENTID", nullable = false)
	@NotNull
	protected Long clientId;

	@Version
	/** Record version number used by the persistence framework. */
	@Column(name = "VERSION", nullable = false)
	@NotNull
	protected Long version;

	@Transient
	public String getClassName() {
		return this.getClass().getCanonicalName();
	}

	public abstract Long getId();

	public abstract void setId(Long id);

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public void aboutToInsert(DescriptorEvent event) {

		event.updateAttributeWithObject("clientId", Session.user.get()
				.getClientId());

	}

	public void aboutToUpdate(DescriptorEvent event) {
		this.__validate_client_context__(this.clientId);
	}
}