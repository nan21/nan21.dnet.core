package net.nan21.dnet.core.presenter.service.ds;

import java.io.File;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.presenter.action.DsCsvLoader;
import net.nan21.dnet.core.presenter.action.DsCsvLoaderResult;
import net.nan21.dnet.core.presenter.exception.ActionNotSupportedException;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;

/**
 * Implements the write actions for an entity-ds. See the super-classes for more
 * details.
 * 
 * @author amathe
 * 
 * @param <M>
 * @param <F>
 * @param <P>
 * @param <E>
 */
public abstract class AbstractEntityDsWriteService<M extends AbstractDsModel<E>, F, P, E>
		extends AbstractEntityDsReadService<M, F, P, E> {

	private boolean noInsert = false;
	private boolean noUpdate = false;
	private boolean noDelete = false;
	private boolean readOnly = false;

	/* ========================== IMSERT =========================== */

	/**
	 * Provide custom logic to decide if the action can be executed.
	 * 
	 * @param list
	 * @param params
	 * @return
	 */
	protected boolean canInsert(M ds, P params) {
		return true;
	}

	/**
	 * Provide custom logic to decide if the action can be executed.
	 * 
	 * @param list
	 * @param params
	 * @return
	 */
	protected boolean canInsert(List<M> list, P params) {
		return true;
	}

	/**
	 * Pre-insert event with the data-source values as received from client.
	 * 
	 * @param ds
	 * @throws Exception
	 */
	protected void preInsert(M ds, P params) throws Exception {
	}

	/**
	 * Pre-insert event with data-source and a new entity instance populated
	 * from the data-source.
	 * 
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void preInsert(M ds, E e, P params) throws Exception {
	}

	/**
	 * Post-insert event. The entity has been persisted by the
	 * <code>entityManager</code>, but the possible changes which might alter
	 * the entity during its persist phase are not applied yet to the
	 * data-source.
	 * 
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void postInsertBeforeModel(M ds, E e, P params) throws Exception {
	}

	/**
	 * Post-insert event. The entity has been persisted by the
	 * <code>entityManager</code>, and the possible changes which might alter
	 * the entity during its persist phase are applied to the data-source.
	 * 
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void postInsertAfterModel(M ds, E e, P params) throws Exception {
	}

	/**
	 * Insert event. The steps performed during this phase are: <li>Check if
	 * action is allowed. <li>Create a new backing entity for the data-source.
	 * <li>Apply the new values from the data-source and call the
	 * <code>pre-insert</code> events <li>Delegate execution of insert to the
	 * business-service. <li>Call the <code>post-insert</code> event.
	 * 
	 * @param ds
	 * @throws Exception
	 */
	public void insert(M ds, P params) throws Exception {
		if (this.readOnly || this.noInsert || !this.canInsert(ds, params)) {
			throw new ActionNotSupportedException("Insert not allowed.");
		}
		// add the client
		if (ds instanceof IModelWithClientId) {
			((IModelWithClientId) ds).setClientId(Session.user.get()
					.getClientId());
		}
		this.preInsert(ds, params);
		E e = (E) this.getEntityService().create();
		this.getConverter().modelToEntity(ds, e, true);
		this.preInsert(ds, e, params);
		this.onInsert(ds, e, params);
		postInsertBeforeModel(ds, e, params);
		this.getConverter().entityToModel(e, ds);
		postInsertAfterModel(ds, e, params);
	}

	protected void onInsert(M ds, E e, P params) throws Exception {
		this.getEntityService().insert(e);
	}

	/**
	 * Template method for <code>pre-insert</code>.
	 * 
	 * @param list
	 * @throws Exception
	 */
	protected void preInsert(List<M> list, P params) throws Exception {

	}

	public void insert(List<M> list, P params) throws Exception {
		if (this.readOnly || this.noInsert) {
			throw new ActionNotSupportedException("Insert not allowed.");
		}
		// add the client
		for (M ds : list) {
			if (ds instanceof IModelWithClientId) {
				((IModelWithClientId) ds).setClientId(Session.user.get()
						.getClientId());
			}
		}
		this.preInsert(list, params);
		// add entities in a queue and then try to insert them all in one
		// transaction
		List<E> entities = new ArrayList<E>();
		for (M ds : list) {
			this.preInsert(ds, params);
			E e = (E) this.getEntityService().create();
			entities.add(e);
			((AbstractDsModel<E>) ds)._setEntity_(e);
			this.getConverter().modelToEntity(ds, e, true);
			this.preInsert(ds, e, params);
		}
		// this.getEntityService().insert(entities);
		this.onInsert(list, entities, params);
		for (M ds : list) {
			E e = ((AbstractDsModel<E>) ds)._getEntity_();
			postInsertBeforeModel(ds, e, params);
			this.getConverter().entityToModel(e, ds);
			postInsertAfterModel(ds, e, params);
		}
		this.postInsert(list, params);
	}

	protected void onInsert(List<M> list, List<E> entities, P params)
			throws Exception {
		this.getEntityService().insert(entities);
	}

	/**
	 * Template method for <code>post-insert</code>.
	 * 
	 * @param list
	 * @throws Exception
	 */
	public void postInsert(List<M> list, P params) throws Exception {

	}

	/* ========================== UPDATE =========================== */

	/**
	 * Provide custom logic to decide if the action can be executed.
	 * 
	 * @param list
	 * @param params
	 * @return
	 */
	protected boolean canUpdate(M ds, P params) {
		return true;
	}

	/**
	 * Provide custom logic to decide if the action can be executed.
	 * 
	 * @param list
	 * @param params
	 * @return
	 */
	protected boolean canUpdate(List<M> list, P params) {
		return true;
	}

	/**
	 * Pre-insert event with the data-source values.
	 * 
	 * @param ds
	 * @throws Exception
	 */
	protected void preUpdate(M ds, P params) throws Exception {
	}

	/**
	 * Pre-insert event with data-source and the corresponding source entity has
	 * been found. The entity has not been yet populated with the new values
	 * from the data-source.
	 * 
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void preUpdateBeforeEntity(M ds, E e, P params) throws Exception {
	}

	/**
	 * Pre-insert event with data-source and the corresponding source entity has
	 * been found. The new values from the data-source are already applied to
	 * the entity.
	 * 
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void preUpdateAfterEntity(M ds, E e, P params) throws Exception {
	}

	/**
	 * Post-update event. The entity has been merged by the
	 * <code>entityManager</code>, but the possible changes which might alter
	 * the entity during its merging phase are not applied yet to the
	 * data-source.
	 * 
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void postUpdateBeforeModel(M ds, E e, P params) throws Exception {
	}

	/**
	 * Post-update event. The entity has been merged by the
	 * <code>entityManager</code>, and the possible changes which might alter
	 * the entity during its merging phase are applied to the data-source.
	 * 
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void postUpdateAfterModel(M ds, E e, P params) throws Exception {
	}

	/**
	 * Update event. The steps performed during this phase are: <li>Check if
	 * action is allowed. <li>Find the backing entity of the data-source. <li>
	 * Apply the new values from the data-source and call the
	 * <code>pre-update</code> events <li>Delegate execution of update to the
	 * business-service. <li>Call the <code>post-update</code> event.
	 * 
	 * @param ds
	 * @throws Exception
	 */
	public void update(M ds, P params) throws Exception {
		if (this.readOnly || this.noUpdate || !this.canUpdate(ds, params)) {
			throw new ActionNotSupportedException("Update not allowed.");
		}

		this.preUpdate(ds, params);
		E e = (E) this.getEntityService().findById(((IModelWithId) ds).getId());
		this.preUpdateBeforeEntity(ds, e, params);
		this.getConverter().modelToEntity(ds, e, false);
		this.preUpdateAfterEntity(ds, e, params);
		this.getEntityService().update(e);
		postUpdateBeforeModel(ds, e, params);
		this.getConverter().entityToModel(e, ds);
		postUpdateAfterModel(ds, e, params);
	}

	/**
	 * Template method for <code>pre-update</code>.
	 * 
	 * @param list
	 * @throws Exception
	 */
	public void preUpdate(List<M> list, P params) throws Exception {
	}

	public void update(List<M> list, P params) throws Exception {
		if (this.readOnly || this.noUpdate || !this.canUpdate(list, params)) {
			throw new ActionNotSupportedException("Update not allowed.");
		}
		this.preUpdate(list, params);
		List<E> entities = this.getEntityService().findByIds(
				this.collectIds(list));

		for (M ds : list) {
			this.preUpdate(ds, params);
			// TODO: optimize me
			E e = lookupEntityById(entities, ((IModelWithId) ds).getId());
			this.preUpdateBeforeEntity(ds, e, params);
			this.getConverter().modelToEntity(ds, e, false);
			this.preUpdateAfterEntity(ds, e, params);
		}
		this.getEntityService().update(entities);
		for (M ds : list) {
			E e = this.getEntityService().getEntityManager()
					.find(this.getEntityClass(), ((IModelWithId) ds).getId());
			postUpdateBeforeModel(ds, e, params);
			this.getConverter().entityToModel(e, ds);
			postUpdateAfterModel(ds, e, params);
		}
		this.postUpdate(list, params);
	}

	private E lookupEntityById(List<E> list, Object id) {
		for (E e : list) {
			if (((IModelWithId) e).getId().equals(id)) {
				return e;
			}
		}
		return null;
	}

	/**
	 * Template method for <code>post-update</code>.
	 * 
	 * @param list
	 * @throws Exception
	 */
	public void postUpdate(List<M> list, P params) throws Exception {

	}

	/* ========================== DELETE =========================== */

	/**
	 * Provide custom logic to decide if the action can be executed.
	 */
	protected boolean canDelete(Object id) {
		return true;
	}

	/**
	 * Provide custom logic to decide if the action can be executed.
	 */
	protected boolean canDelete(List<Object> ids) {
		return true;
	}

	/**
	 * Template method for <code>pre-delete</code>.
	 */
	protected void preDelete(Object id) {
	}

	/**
	 * Template method for <code>post-delete</code>.
	 */
	protected void postDelete(Object id) {
	}

	/**
	 * Delete by id.
	 * 
	 * @param id
	 * @throws Exception
	 */
	public void deleteById(Object id) throws Exception {
		if (this.readOnly || this.noDelete || !this.canDelete(id)) {
			throw new ActionNotSupportedException("Delete not allowed.");
		}
		preDelete(id);
		this.getEntityService().deleteById(id);
		postDelete(id);
	}

	protected void preDelete(List<Object> ids) throws Exception {
	}

	protected void postDelete(List<Object> ids) throws Exception {
	}

	/**
	 * Delete by list of ids
	 * 
	 * @param ids
	 * @throws Exception
	 */
	public void deleteByIds(List<Object> ids) throws Exception {
		if (this.readOnly || this.noDelete || !this.canDelete(ids)) {
			throw new ActionNotSupportedException("Delete not allowed.");
		}
		preDelete(ids);
		this.getEntityService().deleteByIds(ids);
		postDelete(ids);
	}

	/* ========================== IMPORT =========================== */

	public void doImport(String absoluteFileName) throws Exception {
		this.doImportAsInsert_(new File(absoluteFileName));
	}

	public void doImport(String relativeFileName, String path) throws Exception {
		this.doImportAsInsert_(new File(path + "/" + relativeFileName));
	}

	public void doImport(String absoluteFileName, String ukFieldName,
			int batchSize) throws Exception {
		this.doImportAsUpdate_(new File(absoluteFileName), ukFieldName,
				batchSize);
	}

	public void doImport(String relativeFileName, String path,
			String ukFieldName, int batchSize) throws Exception {
		this.doImportAsUpdate_(new File(path + "/" + relativeFileName),
				ukFieldName, batchSize);
	}

	public void doImport(InputStream inputStream, String sourceName)
			throws Exception {
		this.doImportAsInsert_(inputStream, sourceName);
	}

	protected void doImportAsInsert_(InputStream inputStream, String sourceName)
			throws Exception {
		if (this.isReadOnly()) {
			throw new ActionNotSupportedException("Import not allowed.");
		}
		DsCsvLoader l = new DsCsvLoader();
		List<M> list = l.run(inputStream, this.getModelClass(), null,
				sourceName);
		this.insert(list, null);
	}

	protected void doImportAsInsert_(File file) throws Exception {
		if (this.isReadOnly()) {
			throw new ActionNotSupportedException("Import not allowed.");
		}
		DsCsvLoader l = new DsCsvLoader();
		List<M> list = l.run(file, this.getModelClass(), null);
		this.insert(list, null);
	}

	protected void doImportAsUpdate_(File file, String ukFieldName,
			int batchSize) throws Exception {
		if (this.isReadOnly()) {
			throw new ActionNotSupportedException("Import not allowed.");
		}
		Assert.notNull(ukFieldName,
				"For import as update you must specify the unique-key "
						+ "field which is used to lookup the existing record.");

		// TODO: check type-> csv, json, etc
		DsCsvLoader l = new DsCsvLoader();
		DsCsvLoaderResult<M> result = l.run2(file, this.getModelClass(), null);
		List<M> list = result.getResult();
		String[] columns = result.getHeader();

		F filter = this.getFilterClass().newInstance();

		// TODO: optimize me to do the work in batches !!

		Method filterUkFieldSetter = this.getFilterClass().getMethod(
				"set" + StringUtils.capitalize(ukFieldName), String.class);
		Method modelUkFieldGetter = this.getModelClass().getMethod(
				"get" + StringUtils.capitalize(ukFieldName));

		Map<String, Method> modelSetters = new HashMap<String, Method>();
		Map<String, Method> modelGetters = new HashMap<String, Method>();

		int len = columns.length;

		for (int i = 0; i < len; i++) {
			String fieldName = columns[i];
			Class<?> clz = this.getModelClass();
			Field f = null;
			while (f == null && clz != null) {
				try {
					f = clz.getDeclaredField(fieldName);
				} catch (Exception e) {

				}
				clz = clz.getSuperclass();
			}

			if (f != null) {
				Method modelSetter = this.getModelClass().getMethod(
						"set" + StringUtils.capitalize(fieldName), f.getType());
				modelSetters.put(fieldName, modelSetter);

				Method modelGetter = this.getModelClass().getMethod(
						"get" + StringUtils.capitalize(fieldName));
				modelGetters.put(fieldName, modelGetter);
			} else {

			}
		}

		for (M newDs : list) {
			filterUkFieldSetter
					.invoke(filter, modelUkFieldGetter.invoke(newDs));
			List<M> res = this.find(filter);
			// TODO: add an extra flag for what to do if the target is not
			// found:
			// ignore or raise an error
			if (res.size() > 0) {
				M oldDs = this.find(filter).get(0);
				for (Map.Entry<String, Method> entry : modelSetters.entrySet()) {
					entry.getValue().invoke(oldDs,
							modelGetters.get(entry.getKey()).invoke(newDs));
				}
				this.update(oldDs, null);
			}
		}
	}

	// ======================== Getters-setters ===========================

	public boolean isNoInsert() {
		return noInsert;
	}

	public void setNoInsert(boolean noInsert) {
		this.noInsert = noInsert;
	}

	public boolean isNoUpdate() {
		return noUpdate;
	}

	public void setNoUpdate(boolean noUpdate) {
		this.noUpdate = noUpdate;
	}

	public boolean isNoDelete() {
		return noDelete;
	}

	public void setNoDelete(boolean noDelete) {
		this.noDelete = noDelete;
	}

	public boolean isReadOnly() {
		return readOnly;
	}

	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	}

}
