package net.nan21.dnet.core.business.service.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.util.Assert;

import net.nan21.dnet.core.api.exceptions.BusinessException;
import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.business.service.AbstractBusinessBaseService;

/**
 * Implements the read actions as various finders for an entity-service. See the
 * super-classes for more details.
 * 
 * @author amathe
 * 
 * @param <E>
 */
public abstract class AbstractEntityReadService<E> extends
		AbstractBusinessBaseService {

	public abstract Class<E> getEntityClass();

	/**
	 * Create a new entity instance
	 */
	public E create() throws BusinessException {
		try {
			return this.getEntityClass().newInstance();
		} catch (Exception e) {
			throw new BusinessException("Cannot create a new instance of "
					+ this.getEntityClass().getCanonicalName(), e);
		}
	}

	/**
	 * Find entity by id.
	 */
	public E findById(Object object) {
		return this.getEntityManager().find(getEntityClass(), object);
	}

	/**
	 * Find all entities.
	 */
	@SuppressWarnings("unchecked")
	public List<E> findAll() {
		if (IModelWithClientId.class.isAssignableFrom(this.getEntityClass())) {
			return (List<E>) this
					.getEntityManager()
					.createQuery(
							"select e from " + getEntityClass().getSimpleName()
									+ " e where e.clientId = :pClientId ")
					.setParameter("pClientId", Session.user.get().getClientId())
					.getResultList();
		} else {
			return (List<E>) this
					.getEntityManager()
					.createQuery(
							"select e from " + getEntityClass().getSimpleName()
									+ " e ").getResultList();
		}

	}

	/**
	 * Find entities by ids.
	 */
	@SuppressWarnings("unchecked")
	public List<E> findByIds(List<Object> ids) {
		if (IModelWithClientId.class.isAssignableFrom(this.getEntityClass())) {
			return (List<E>) this
					.getEntityManager()
					.createQuery(
							"select e from "
									+ getEntityClass().getSimpleName()
									+ " e where  e.clientId = :pClientId and e.id in :pIds ")
					.setParameter("pIds", ids)
					.setParameter("pClientId", Session.user.get().getClientId())
					.getResultList();
		} else {
			return (List<E>) this
					.getEntityManager()
					.createQuery(
							"select e from " + getEntityClass().getSimpleName()
									+ " e where e.id in :pIds ")
					.setParameter("pIds", ids).getResultList();
		}

	}

	/**
	 * Find an entity by unique-key.
	 */
	public E findByUk(String namedQueryName, Map<String, Object> params) {
		TypedQuery<E> q = this.getEntityManager().createNamedQuery(
				namedQueryName, this.getEntityClass());
		Set<String> keys = params.keySet();
		q.setParameter("pClientId", Session.user.get().getClientId());
		for (String key : keys) {
			q.setParameter(key, params.get(key));
		}
		return (E) q.getSingleResult();
	}

	public List<E> findEntitiesByAttributes(Map<String, Object> params)
			throws BusinessException {
		return findEntitiesByAttributes(this.getEntityClass(), params);
	}

	public E findEntityByAttributes(Map<String, Object> params)
			throws BusinessException {
		return findEntityByAttributes(this.getEntityClass(), params);
	}

	public <T> List<T> findEntitiesByAttributes(Class<T> entityClass,
			Map<String, Object> params) throws BusinessException {
		CriteriaBuilder cb = this.getEntityManager().getCriteriaBuilder();
		CriteriaQuery<T> cq = cb.createQuery(entityClass);
		Root<T> root = cq.from(entityClass);
		cq.select(root);
		Assert.notNull(params);
		Predicate p = null;
		// Iterator<String> it = params.entrySet().iterator();
		if (entityClass.isAssignableFrom(IModelWithClientId.class)) {
			p = cb.equal(root.get("clientId"), Session.user.get().getClientId());
		}
		for (Map.Entry<String, Object> entry : params.entrySet()) {
			p = cb.and(cb.equal(root.get(entry.getKey()), entry.getValue()));
		}
		cq.where(p);
		TypedQuery<T> query = this.getEntityManager().createQuery(cq);
		return (List<T>) query.getResultList();

	}

	public <T> T findEntityByAttributes(Class<T> entityClass,
			Map<String, Object> params) throws BusinessException {
		CriteriaBuilder cb = this.getEntityManager().getCriteriaBuilder();
		CriteriaQuery<T> cq = cb.createQuery(entityClass);
		Root<T> root = cq.from(entityClass);
		cq.select(root);
		Assert.notNull(params);
		Predicate p = null;
		// Iterator<String> it = params.entrySet().iterator();
		if (entityClass.isAssignableFrom(IModelWithClientId.class)) {
			p = cb.equal(root.get("clientId"), Session.user.get().getClientId());
		}
		for (Map.Entry<String, Object> entry : params.entrySet()) {
			p = cb.and(cb.equal(root.get(entry.getKey()), entry.getValue()));
		}
		cq.where(p);
		TypedQuery<T> query = this.getEntityManager().createQuery(cq);
		return (T) query.getSingleResult();

	}

	protected List<Object> collectIds(List<? extends IModelWithId> entities) {
		List<Object> result = new ArrayList<Object>();
		for (IModelWithId e : entities) {
			result.add(e.getId());
		}
		return result;
	}
}
