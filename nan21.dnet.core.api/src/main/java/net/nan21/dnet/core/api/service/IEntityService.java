package net.nan21.dnet.core.api.service;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.exceptions.BusinessException;

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
	 * @throws BusinessException
	 */
	public List<E> findAll() throws BusinessException;

	/**
	 * Retrieve an entity by its ID
	 * 
	 * @param id
	 * @return
	 * @throws BusinessException
	 */
	public E findById(Object id) throws BusinessException;

	/**
	 * Retrieve entities which match the given list of IDs.
	 * 
	 * @param ids
	 * @return
	 * @throws BusinessException
	 */
	public List<E> findByIds(List<Object> ids) throws BusinessException;

	/**
	 * Find an entity by unique-key.
	 * 
	 * @param namedQueryName
	 *            the associated named query
	 * @param params
	 *            Parameters with values for the unique-key fields.
	 * @return
	 * @throws BusinessException
	 */
	public E findByUk(String namedQueryName, Map<String, Object> params)
			throws BusinessException;

	public <T> List<T> findEntitiesByAttributes(Class<T> entityClass,
			Map<String, Object> params) throws BusinessException;

	public <T> T findEntityByAttributes(Class<T> entityClass,
			Map<String, Object> params) throws BusinessException;

	public List<E> findEntitiesByAttributes(Map<String, Object> params)
			throws BusinessException;

	public E findEntityByAttributes(Map<String, Object> params)
			throws BusinessException;

	public void deleteById(Object id) throws BusinessException;

	public void deleteByIds(List<Object> ids) throws BusinessException;

	public void delete(List<E> list) throws BusinessException;

	/**
	 * Insert a list of new entities. This should be a transactional method.
	 * 
	 * @param list
	 * @throws BusinessException
	 */
	public void insert(List<E> list) throws BusinessException;

	/**
	 * Helper insert method for one single entity. It creates a list with this
	 * single entity and delegates to the <code> insert(List<E> list)</code>
	 * method
	 */
	public void insert(E e) throws BusinessException;

	/**
	 * Update a list of existing entities. This should be a transactional
	 * method.
	 * 
	 * @param list
	 * @throws BusinessException
	 */
	public void update(List<E> list) throws BusinessException;

	/**
	 * Helper update method for one single entity. It creates a list with this
	 * single entity and delegates to the <code> update(List<E> list)</code>
	 * method
	 */
	public void update(E e) throws BusinessException;

	/**
	 * Execute an update JPQL statement. This should be a transactional method.
	 * 
	 * @param jpqlStatement
	 * @param parameters
	 * @return
	 * @throws BusinessException
	 */
	public int update(String jpqlStatement, Map<String, Object> parameters)
			throws BusinessException;

	public E create() throws BusinessException;

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

	public void doStartWfProcessInstanceByKey(String processDefinitionKey,
			String businessKey, Map<String, Object> variables)
			throws BusinessException;

	public void doStartWfProcessInstanceById(String processDefinitionId,
			String businessKey, Map<String, Object> variables)
			throws BusinessException;

	public void doStartWfProcessInstanceByMessage(String messageName,
			String businessKey, Map<String, Object> processVariables)
			throws BusinessException;

}