package net.nan21.dnet.core.business.service.entity;

import java.util.List;
import java.util.Map;

import javax.persistence.Query;

import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.session.Session;

/**
 * Implements the write actions for an entity-service. See the super-classes for
 * more details.
 * 
 * @author amathe
 * 
 * @param <E>
 */
public abstract class AbstractEntityWriteService<E> extends
		AbstractEntityReadService<E> {
	//
	// /**
	// * Return a new instance of a business delegate by the given class.
	// *
	// * @param <T>
	// * @param clazz
	// * @return
	// * @throws Exception
	// */
	// public <T extends AbstractBusinessDelegate> T getBusinessDelegate(
	// Class<T> clazz) throws Exception {
	// T delegate = clazz.newInstance();
	// delegate.setAppContext(this.getApplicationContext());
	// delegate.setEntityManager(this.em);
	// return delegate;
	// }

	/* ========================== INSERT =========================== */
	/**
	 * Pre-insert template method for one entity.
	 * 
	 * @param e
	 */
	protected void preInsert(E e) throws Exception {
	}

	/**
	 * On-insert template method for one entity, it actually does the work.
	 * 
	 * @param e
	 */
	protected void onInsert(E e) throws Exception {
		this.em.persist(e);
	}

	/**
	 * Insert (persist) one entity.
	 */
	public void insert(E e) throws Exception {
		this.preInsert(e);
		this.onInsert(e);
		this.postInsert(e);
	}

	/**
	 * Post-insert template method for one entity.
	 * 
	 * @param list
	 */
	protected void postInsert(E e) throws Exception {
	}

	/**
	 * Pre-insert template method for a collection of entities.
	 * 
	 * @param list
	 */
	protected void preInsert(List<E> list) throws Exception {
	}

	/**
	 * On-insert template method for a collection of entities, it actually does
	 * the work.
	 * 
	 * @param list
	 */
	protected void onInsert(List<E> list) throws Exception {
		for (E e : list) {
			this.insert(e);
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
	 * 
	 * @param list
	 */
	protected void postInsert(List<E> list) throws Exception {
	}

	/* ========================== UPDATE =========================== */

	/**
	 * Pre-update template method for one entity.
	 * 
	 * @param e
	 */
	protected void preUpdate(E e) throws Exception {
	}

	/**
	 * On-update template method for one entity, it actually does the work.
	 * 
	 * @param e
	 */
	protected void onUpdate(E e) throws Exception {
		this.em.merge(e);
	}

	/**
	 * Update (merge) one entity.
	 */
	public void update(E e) throws Exception {
		this.preUpdate(e);
		this.onUpdate(e);
		this.postUpdate(e);
	}

	/**
	 * Post-update template method for one entity.
	 * 
	 * @param e
	 */
	protected void postUpdate(E e) throws Exception {
	}

	/**
	 * Pre-update template method for a collection of entities.
	 * 
	 * @param list
	 */
	protected void preUpdate(List<E> list) throws Exception {
	}

	/**
	 * On-update template method for a collection of entities, it actually does
	 * the work.
	 * 
	 * @param list
	 */
	protected void onUpdate(List<E> list) throws Exception {
		for (E e : list) {
			this.update(e);
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
	 * 
	 * @param list
	 */
	protected void postUpdate(List<E> list) throws Exception {
	}

	/**
	 * Execute a JPQL update statement.
	 * 
	 * @param jpqlStatement
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public int update(String jpqlStatement, Map<String, Object> parameters)
			throws Exception {
		Query q = this.getEntityManager().createQuery(jpqlStatement);

		for (Map.Entry<String, Object> p : parameters.entrySet()) {
			q.setParameter(p.getKey(), p.getValue());
		}
		return q.executeUpdate();
	}

	/* ========================== DELETE =========================== */

	/**
	 * Pre-delete template method for a given id.
	 * 
	 * @param list
	 */
	protected void preDeleteById(Object id) throws Exception {
	}

	/**
	 * On-delete method for a given id, it actually does the work.
	 * 
	 * @param list
	 */
	protected void onDeleteById(Object id) throws Exception {

		if (IModelWithClientId.class.isAssignableFrom(this.getEntityClass())) {
			this.em.createQuery(
					"delete from "
							+ getEntityClass().getSimpleName()
							+ " e where e.clientId = :pClientId and e.id = :pId")
					.setParameter("pId", id)
					.setParameter("pClientId", Session.user.get().getClientId())
					.executeUpdate();

		} else {
			this.em.createQuery(
					"delete from " + getEntityClass().getSimpleName()
							+ " e where e.id = :pId").setParameter("pId", id)
					.executeUpdate();
		}

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
	 * 
	 * @param list
	 */
	protected void postDeleteById(Object id) throws Exception {
	}

	/**
	 * Pre-delete template method for a list of IDs.
	 * 
	 * @param list
	 */
	protected void preDeleteByIds(List<Object> ids) throws Exception {
	}

	/**
	 * On-delete template method for a list of IDs, it actually does the work.
	 * 
	 * @param list
	 */
	protected void onDeleteByIds(List<Object> ids) throws Exception {

		if (IModelWithClientId.class.isAssignableFrom(this.getEntityClass())) {
			this.em.createQuery(
					"delete from "
							+ getEntityClass().getSimpleName()
							+ " e where e.clientId = :pClientId and e.id in :pIds")
					.setParameter("pIds", ids)
					.setParameter("pClientId", Session.user.get().getClientId())
					.executeUpdate();

		} else {
			this.em.createQuery(
					"delete from " + getEntityClass().getSimpleName()
							+ " e where  e.id in :pIds")
					.setParameter("pIds", ids).executeUpdate();
		}

	}

	/**
	 * Delete entities by a list of IDs.
	 */
	public void deleteByIds(List<Object> ids) throws Exception {
		this.preDeleteByIds(ids);
		this.onDeleteByIds(ids);
		this.postDeleteByIds(ids);
	}

	/**
	 * Post-delete template method for a list of IDs.
	 * 
	 * @param list
	 */
	protected void postDeleteByIds(List<Object> ids) throws Exception {
	}

}
