package net.nan21.dnet.core.domain.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
 

/**
 * Abstract class for entity service implementations.
 * @author AMATHE
 *
 * @param <E> domain entity
 */
public abstract class AbstractEntityService <E>  {
 
	protected abstract Class<E> getEntityClass();
	
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

	/**
	 * Find entity by id.
	 */
	public E findById(Object object) {
		return this.em.find(getEntityClass(), object);
	}
	
	/**
	 * Find entities by ids.
	 */
	public List<E> findByIds(List<Object> ids) {
		//TypedQuery<E> q = (TypedQuery<E>)this.em.createQuery("select e from "+getEntityClass().getSimpleName()+" e where e.id in :pIds ",this.getEntityClass());
		return (List<E>) this.em.createQuery("select e from "+getEntityClass().getSimpleName()+" e where e.id in :pIds " ).setParameter("pIds", ids)
				.getResultList();
	}
	
	/**
	 * Find an entity by unique-key.
	 */
	public E findByUk(String namedQueryName, Map<String, Object> params) {
		TypedQuery<E> q = this.em.createNamedQuery(namedQueryName, this.getEntityClass());
		Set<String> keys  = params.keySet();
		for(String key: keys) {
			q.setParameter(key, params.get(key));
		}
		return (E)q.getSingleResult();
	}
	
	/**
	 * Delete entity by id.
	 */
	public void deleteById(Object id) {
	    this.em.createQuery("delete from "+getEntityClass().getSimpleName()+" e where e.id = :pId")
				.setParameter("pId", id).executeUpdate();
	}

	/**
	 * Delete entities by ids.
	 */
	public void deleteByIds(List<Object> ids) {
	    this.em.createQuery("delete from "+getEntityClass().getSimpleName()+" e where e.id in :pIds")
				.setParameter("pIds", ids).executeUpdate();
	}

	/**
	 * Remove entity.
	 */
	public void remove(E e) throws Exception {
		this.em.remove(e);		
	}

	/**
	 * Remove entities.
	 * @param list
	 * @throws Exception
	 */
	public void remove(List<E> list) throws Exception {
		for(E e: list) {
			this.em.remove(e);
		}		
	}

	/**
	 * Create a new entity instance
	 */
	public E create() throws Exception {
		return this.getEntityClass().newInstance();
	}
	
	/**
	 * Insert (persist) one entity.
	 */
 
	public void insert(E e) throws Exception {		 
		this.em.persist(e); 
	}

	/**
	 * Insert (persist) a list of entities.
	 */
	 
	public void insert(List<E> list) throws Exception {
		for(E e: list) {
			this.em.persist(e);
		}			
	}

	/**
	 * Update (merge) one entity.  
	 */
	 
	public void update(E e) throws Exception {
		this.em.merge(e);
	}

	/**
	 * Update (merge) a list of entities.
	 */
 
	public void update(List<E> list) throws Exception {
		for(E e: list) {
			this.em.merge(e);
		}	
	}
 
	
}
