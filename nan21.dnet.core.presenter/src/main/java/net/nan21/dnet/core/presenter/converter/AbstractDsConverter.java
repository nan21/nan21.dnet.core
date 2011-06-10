package net.nan21.dnet.core.presenter.converter;

import javax.persistence.EntityManager;

import org.springframework.beans.BeanUtils;

import net.nan21.dnet.core.api.converter.IDsConverter;
import net.nan21.dnet.core.api.descriptor.IDsDescriptor;

public abstract class AbstractDsConverter<M, E> implements IDsConverter<M, E>{

	protected EntityManager em;
	protected IDsDescriptor dsDescriptor;	

	public void entityToModel(E e, M m) {		
		this.entityToModelAttributes(e, m);
		this.entityToModelReferences(e, m);
	}
	protected void entityToModelAttributes(E e, M m) {
		BeanUtils.copyProperties(e, m);
	}
	protected void entityToModelReferences(E e, M m) {
		 
	} 
	
	public void modelToEntity(M m, E e) {
		this.modelToEntityAttributes(m, e);
		this.modelToEntityReferences(m, e);
	}
	protected void modelToEntityAttributes(M m, E e) {
		BeanUtils.copyProperties(m,e);		
	}
	protected void modelToEntityReferences(M m, E e) {
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
