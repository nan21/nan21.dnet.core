package net.nan21.dnet.core.domain.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;

import net.nan21.dnet.core.api.model.IModelWithId;

@MappedSuperclass
public abstract class AbstractSimpleEntityNoTenant implements Serializable,
		IModelWithId {

	private static final long serialVersionUID = -1L;

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

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

}