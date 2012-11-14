package net.nan21.dnet.core.domain.model.impldummy;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import net.nan21.dnet.core.domain.model.AbstractAuditable;

@Entity
@Table(name="X_DUMMY1")
public class AbstractAuditableDummy extends AbstractAuditable {

	private static final long serialVersionUID = -1L;
	
	@Id
	@GeneratedValue
	private Long id;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
}
