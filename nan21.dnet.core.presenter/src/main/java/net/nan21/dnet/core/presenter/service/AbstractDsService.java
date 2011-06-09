package net.nan21.dnet.core.presenter.service;

import java.lang.reflect.Method;
import java.util.List;

import net.nan21.dnet.core.api.action.IActionContextFind;
import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.action.IActionResultSave;
import net.nan21.dnet.core.api.action.IExportWriter;
import net.nan21.dnet.core.api.converter.IDsConverter;
import net.nan21.dnet.core.api.descriptor.IDsDescriptor;
import net.nan21.dnet.core.api.model.IDsModel;
import net.nan21.dnet.core.api.model.IDsParam;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.presenter.exception.ActionNotSupportedException;

public class AbstractDsService<M extends IDsModel<?>, P extends IDsParam, E> {
 
	protected boolean noInsert = false;
	protected boolean noUpdate = false;
	protected boolean noDelete = false;
	
	
	protected Class<M> modelClass;
	protected Class<P> paramClass;
 
	protected Class<P> getParamClass() {
		return this.paramClass;
	}

	protected Class<M> getModelClass() {
		return this.modelClass;
	}
	
	protected IEntityService<E> getEntityService() {
		return null;
	}
	protected IDsConverter<M, E> getConverter() {
		return null;
	} 
	
	// ======================== Find ===========================
	
	public Long count(M filter, P params,
			IActionContextFind ctx) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
	
	protected void preFind(M filter, P params,
			IActionContextFind ctx) throws Exception{
	}
	
	public List<M> find(M filter, P params,
			IActionContextFind ctx) throws Exception {
		 
		return null;
	}
	
	protected void postFind(M filter, P params,
			IActionContextFind ctx) throws Exception{
	}
	
	 
	  
	public M findById(Object id) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
 
	public List<M> findByIds(List<Object> ids) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
	
	// ======================== Insert ===========================
	
	/**
	 * Pre-insert event with the data-source values as received from client.
	 * @param ds
	 * @throws Exception
	 */
	protected void preInsert(M ds) throws Exception{
	}
	
	/**
	 * Pre-insert event with data-source and a new entity instance populated from the data-source.
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void preInsert(M ds, E e) throws Exception{
	}
	/**
	 * Post-insert event. The entity has been persisted by the <code>entityManager</code>, 
	 * but the possible changes which might alter the entity during its persist phase 
	 * are not applied yet to the data-source.  
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void postInsert(M ds, E e) throws Exception{
	}
	/**
	 * Insert event. The steps performed during this phase are:
	 * <li> Check if action is allowed.
	 * <li> Create a new backing entity for the data-source.
	 * <li> Apply the new values from the data-source and call the <code>pre-insert</code> events 
	 * <li> Delegate execution of insert to the business-service.
	 * <li> Call the <code>post-insert</code> event.
	 * @param ds
	 * @throws Exception
	 */
	public void insert(M ds) throws Exception {
		if (this.noInsert) {
			throw new ActionNotSupportedException("Insert not allowed.");
		}
		this.preInsert(ds);
		E e = this.getEntityService().create();		 
		this.getConverter().modelToEntity(ds, e);
		this.preInsert(ds,e);
		this.getEntityService().insert(e);
		postInsert(ds, e);
		
	}
 
	/**
	 * Template method for <code>pre-insert</code>.
	 * @param list
	 * @throws Exception
	 */
	public void preInsert(List<M> list) throws Exception {
		 
	}
	
	public void insert(List<M> list) throws Exception {
		 this.preInsert(list);
		 
		 
		 this.postInsert(list);
	}
	/**
	 * Template method for <code>post-insert</code>.
	 * @param list
	 * @throws Exception
	 */
	public void postInsert(List<M> list) throws Exception {
		 
	}
	// ======================== Update ===========================
	
	/**
	 * Pre-insert event with the data-source values.
	 * @param ds
	 * @throws Exception
	 */
	protected void preUpdate(M ds) throws Exception{
	}
	
	/**
	 * Pre-insert event with data-source and the corresponding source entity has been found.
	 * The entity has not been yet populated with the new values from the data-source.
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void preUpdateBeforeEntity(M ds, E e) throws Exception{
	}
	/**
	 * Pre-insert event with data-source and the corresponding source entity has been found.
	 * The new values from the data-source are already applied to the entity.
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void preUpdateAfterEntity(M ds, E e) throws Exception{
	}
	/**
	 * Post-update event. The entity has been merged by the <code>entityManager</code>, 
	 * but the possible changes which might alter the entity during its merging phase 
	 * are not applied yet to the data-source.  
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void postUpdate(M ds, E e) throws Exception{
	}
	
	/**
	 * Update event. The steps performed during this phase are:
	 * <li> Check if action is allowed.
	 * <li> Find the backing entity of the data-source.
	 * <li> Apply the new values from the data-source and call the <code>pre-update</code> events 
	 * <li> Delegate execution of update to the business-service.
	 * <li> Call the <code>post-update</code> event.
	 * @param ds
	 * @throws Exception
	 */
	public void update(M ds) throws Exception {
		if (this.noInsert) {
			throw new ActionNotSupportedException("Update not allowed.");
		}
		this.preInsert(ds);
		E e = this.getEntityService().create();		 
		this.getConverter().modelToEntity(ds, e);
		this.preInsert(ds,e);
		this.getEntityService().insert(e);
		postInsert(ds, e);
		
	}
	
	/**
	 * Template method for <code>pre-update</code>.
	 * @param list
	 * @throws Exception
	 */
	public void preUpdate(List<M> list) throws Exception {		 
	}
	
	public void update(List<M> list) throws Exception {
		 
	}
	/**
	 * Template method for <code>post-update</code>.
	 * @param list
	 * @throws Exception
	 */
	public void postUpdate(List<M> list) throws Exception {
		 
	}
	
	// ======================== Delete ===========================
	
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
	 * @param id
	 * @throws Exception
	 */
	public void deleteById(Object id) throws Exception {
		if (this.noDelete) {
			throw new ActionNotSupportedException("Delete not allowed.");
		}
		preDelete(id);
		this.getEntityService().deleteById(id);
		postDelete(id);
	}

	
	protected void preDelete(List<Object> ids) throws Exception {
	}

	protected void postDelete(List<Object> ids) throws Exception  {
	}

	/**
	 * Delete by list of ids
	 * @param ids
	 * @throws Exception
	 */
	public void deleteByIds(List<Object> ids) throws Exception {
		if (this.noDelete) {
			throw new ActionNotSupportedException("Delete not allowed.");
		}
		preDelete(ids);
		this.getEntityService().deleteByIds(ids);
		postDelete(ids);
	}
	
	
	// ======================== Export ===========================
	 
	public void export(M filter, P params,
			IActionContextFind ctx, IExportWriter writer) throws Exception {
		 
		 
	}
	
	// ======================== Service ===========================
	
	public void service(String procedureName, M ds) throws Exception {
		Method m = this.getClass().getMethod("execute" + procedureName,
				this.getModelClass());
		m.invoke(this, ds);
	}

	public void service(String procedureName, List<M> list) throws Exception {
		Method m = this.getClass().getMethod("execute" + procedureName,
				List.class);
		m.invoke(this, list);
	}
	
	
}
