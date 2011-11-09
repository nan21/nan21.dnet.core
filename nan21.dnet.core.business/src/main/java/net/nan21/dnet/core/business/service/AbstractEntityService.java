package net.nan21.dnet.core.business.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import org.springframework.beans.factory.annotation.Autowired;
 

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
	 * Find all entities.
	 */
	public List<E> findAll() {
		return this.em.createQuery("select e from "+getEntityClass().getSimpleName()+" e" )
			.getResultList();
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
	 * Delete all.
	 
	public void deleteAll() {
	    this.em.createQuery("delete from "+getEntityClass().getSimpleName()+" e")
				.executeUpdate();
	}
	*/
	/**
	 * Pre-delete template method for a given id.
	 * @param list
	 */
	protected void preDeleteById(Object id) throws Exception {		
	}
	
	/**
	 * On-delete method for a given id, it actually does the work.
	 * @param list
	 */
	protected void onDeleteById(Object id) throws Exception {
		this.em.createQuery("delete from "+getEntityClass().getSimpleName()+" e where e.id = :pId")
			.setParameter("pId", id).executeUpdate();
	}
	/**
	 * Delete entity by id.
	 */
	public void deleteById(Object id) throws Exception {
		this.preDeleteById(id);
		this.onDeleteById(id);
		this.postDeleteById(id);
	}

	/**
	 * Post-delete template method for a given id.
	 * @param list
	 */
	protected void postDeleteById(Object id) throws Exception{		
	}
	
	
	
	/**
	 * Pre-delete template method for a list of IDs.
	 * @param list
	 */
	protected void preDeleteByIds(List<Object> ids) throws Exception{		
	}
	
	/**
	 * On-delete template method for a list of IDs, it actually does the work.
	 * @param list
	 */
	protected void onDeleteByIds(List<Object> ids) throws Exception{	
		this.em.createQuery("delete from "+getEntityClass().getSimpleName()+" e where e.id in :pIds")
			.setParameter("pIds", ids).executeUpdate();
	}
	/**
	 * Delete entities by a list of IDs.
	 */
	public void deleteByIds(List<Object> ids) throws Exception{
		this.preDeleteByIds(ids);
		this.onDeleteByIds(ids);
		this.postDeleteByIds(ids);
	}

	/**
	 * Post-delete template method for a list of IDs.
	 * @param list
	 */
	protected void postDeleteByIds(List<Object> ids) throws Exception {		
	}
	
	/**
	 * Remove entity.
	 
	public void remove(E e) throws Exception {
		this.em.remove(e);		
	}*/

	/**
	 * Remove entities.
	 * @param list
	 * @throws Exception
	 
	public void remove(List<E> list) throws Exception {
		for(E e: list) {
			this.em.remove(e);
		}		
	}*/

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
	 * Pre-insert template method for a collection of entities.
	 * @param list
	 */
	protected void preInsert(List<E> list) throws Exception {		
	}
	
	/**
	 * On-insert template method for a collection of entities, it actually does the work.
	 * @param list
	 */
	protected void onInsert(List<E> list) throws Exception {	
		for(E e: list) {
			this.em.persist(e);
		}
	}
	
	/**
	 * Insert (persist) a list of entities.
	 */	 
	public void insert(List<E> list) throws Exception {
		this.preInsert(list);
		this.onInsert(list);
		this.postInsert(list);
	}

	/**
	 * Post-insert template method for a collection of entities.
	 * @param list
	 */
	protected void postInsert(List<E> list) throws Exception {		
	}
	/**
	 * Update (merge) one entity.  
	 */
	 
	public void update(E e) throws Exception {		
		this.em.merge(e);
	}

	
	/**
	 * Pre-update template method for a collection of entities.
	 * @param list
	 */
	protected void preUpdate(List<E> list) throws Exception {		
	}
	
	/**
	 * On-update template method for a collection of entities, it actually does the work.
	 * @param list
	 */
	protected void onUpdate(List<E> list) throws Exception {	
		for(E e: list) {
			this.em.merge(e);
		}
	}
	/**
	 * Update (merge) a list of entities.
	 */
  
	public void update(List<E> list) throws Exception {		
		this.preUpdate(list);
		this.onUpdate(list);
		this.postUpdate(list);
	}
 
	/**
	 * Post-update template method for a collection of entities.
	 * @param list
	 */
	protected void postUpdate(List<E> list) throws Exception {		
	}
	
	 
	public int update(String jpqlStatement, Map<String, Object> parameters) throws Exception {
		Query q = this.getEntityManager()
			.createQuery(jpqlStatement);
		
		for (Map.Entry<String, Object> p : parameters.entrySet()) {
			q.setParameter(p.getKey(), p.getValue());
		}
		return q.executeUpdate();	
	}
	
	public <T extends AbstractBusinessDelegate> T getBusinessDelegate(Class<T> clazz) throws Exception {
		T delegate = clazz.newInstance();
		//delegate.setAppContext(this.appContext);
		delegate.setEntityManager(this.em);
		return delegate;
	}
}
