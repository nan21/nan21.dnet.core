package net.nan21.dnet.core.business.service;
 
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
 
import net.nan21.dnet.core.api.setup.AbstractSetupParticipant;
import net.nan21.dnet.core.api.setup.IInitDataProviderFactory;
 

public abstract class AbstractBusinessSetupParticipant extends AbstractSetupParticipant {

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
	
	protected List<IInitDataProviderFactory> getDataProviderFactories() {
		return (List<IInitDataProviderFactory>)this.appContext.getBean("osgiInitDataProviderFactories");
	}
	 
}
