package net.nan21.dnet.core.api.service;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import net.nan21.dnet.core.api.ISystemConfig;

/**
 * Base interface to be implemented by business services. A business service or
 * entity service is the entry point to the transactional business logic of the
 * application.
 * 
 * By default it is expected to be an entity service for each entity to provide
 * two types of functionalities:
 * <ul>
 * <li>Repository features: finder methods</li>
 * <li>Transactional functionality to insert, update and delete data as well as
 * various business functions.</li>
 * </ul>
 * 
 * This interface declares some of the generic methods for the aforementioned
 * ones. Specific methods should be declared in the entity specific interface
 * which should extend this.
 * 
 *  
 * 
 * @author amathe
 * 
 * @param <E>
 */
public interface IEntityService<E> {

	/**
	 * Get EntityManager
	 * 
	 * @return
	 */
	public EntityManager getEntityManager();

	/**
	 * Set EntityManager
	 * 
	 * @param em
	 */
	public void setEntityManager(EntityManager em);

	/**
	 * Retrieve all entities of the given type.
	 * 
	 * @return
	 * @throws Exception
	 */
	public List<E> findAll() throws Exception;

	/**
	 * Retrieve an entity by its ID
	 * 
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public E findById(Object id) throws Exception;

	/**
	 * Retrieve entities which match the given list of IDs.
	 * 
	 * @param ids
	 * @return
	 * @throws Exception
	 */
	public List<E> findByIds(List<Object> ids) throws Exception;

	/**
	 * Find an entity by unique-key.
	 * 
	 * @param namedQueryName
	 *            the associated named query
	 * @param params
	 *            Parameters with values for the unique-key fields.
	 * @return
	 * @throws Exception
	 */
	public E findByUk(String namedQueryName, Map<String, Object> params)
			throws Exception;

	
	public <T> List<T> findEntitiesByAttributes(Class<T> entityClass, Map<String, Object> params) throws Exception;
	public <T> T findEntityByAttributes(Class<T> entityClass, Map<String, Object> params) throws Exception;
	
	public List<E> findEntitiesByAttributes( Map<String, Object> params) throws Exception ;
	
	public E findEntityByAttributes( Map<String, Object> params) throws Exception;
	
	public void deleteById(Object id) throws Exception;

	public void deleteByIds(List<Object> ids) throws Exception;

	/**
	 * Insert a new entity. This should be a transactional method.
	 * 
	 * @param e
	 * @throws Exception
	 */
	public void insert(E e) throws Exception;

	/**
	 * Insert a list of new entities. This should be a transactional method.
	 * 
	 * @param list
	 * @throws Exception
	 */
	public void insert(List<E> list) throws Exception;

	/**
	 * Update an existing entity. This should be a transactional method.
	 * 
	 * @param e
	 * @throws Exception
	 */
	public void update(E e) throws Exception;

	/**
	 * Update a list of existing entities. This should be a transactional
	 * method.
	 * 
	 * @param list
	 * @throws Exception
	 */
	public void update(List<E> list) throws Exception;

	/**
	 * Execute an update JPQL statement. This should be a transactional method.
	 * 
	 * @param jpqlStatement
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public int update(String jpqlStatement, Map<String, Object> parameters)
			throws Exception;

	// public void remove(E e) throws Exception;
	// public void remove(List<E> list) throws Exception;

	public E create() throws Exception;

	/**
	 * Getter for system configuration.
	 * 
	 * @return
	 */
	public ISystemConfig getSystemConfig();

	/**
	 * Setter for system configuration.
	 * 
	 * @param systemConfig
	 */
	public void setSystemConfig(ISystemConfig systemConfig);

}