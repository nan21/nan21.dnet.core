package net.nan21.dnet.core.presenter.converter;

import javax.persistence.EntityManager;

import org.springframework.beans.BeanUtils;

import net.nan21.dnet.core.api.converter.IDsConverter;
import net.nan21.dnet.core.api.descriptor.IDsDescriptor;

public abstract class AbstractDsConverter<M, E> implements IDsConverter<M, E> {

	protected EntityManager em;
	protected IDsDescriptor dsDescriptor;	
	
	 
	public void entityToModel(E e, M m) {		
		BeanUtils.copyProperties(e, m);
	}

	 
	public void modelToEntity(M m, E e) {
		BeanUtils.copyProperties(m,e);		
	}
	
	
	public IDsDescriptor getDsDescriptor() {
		return dsDescriptor;
	}

	public void setDsDescriptor(IDsDescriptor dsDescriptor) {
		this.dsDescriptor = dsDescriptor;
	}

	public EntityManager getEntityManager() {
		return this.em;
	}

	public void setEntityManager(EntityManager em) {
		this.em = em;
	}
}
