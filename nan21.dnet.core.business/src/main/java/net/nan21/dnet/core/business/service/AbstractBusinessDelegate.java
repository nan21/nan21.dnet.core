package net.nan21.dnet.core.business.service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public abstract class AbstractBusinessDelegate {

	@Autowired
	protected ApplicationContext appContext;
	
	@PersistenceContext
	@Autowired
	protected EntityManager em;	 
	
	/*
	 * @return the entity manager  
	 */
	public EntityManager getEntityManager() {
		return this.em;
	}

	/*
	 * @param em the entity manager to set
	 */
	public void setEntityManager(EntityManager em) {
		this.em = em;		 
	}

	public ApplicationContext getAppContext() {
		return appContext;
	}

	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}  
 
}
