package net.nan21.dnet.core.presenter.service;

import java.io.File;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
 
import net.nan21.dnet.core.api.action.IExportWriter;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.converter.IDsConverter;
import net.nan21.dnet.core.api.descriptor.IDsDescriptor;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.model.IDsParam;
import net.nan21.dnet.core.api.model.IModelWithClientId;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.domain.session.Session;
import net.nan21.dnet.core.presenter.action.DsCsvLoader;
import net.nan21.dnet.core.presenter.action.QueryBuilderWithJpql;
import net.nan21.dnet.core.presenter.converter.BaseDsConverter;
import net.nan21.dnet.core.presenter.exception.ActionNotSupportedException;
import net.nan21.dnet.core.presenter.marshaller.JsonMarshaller;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;
import net.nan21.dnet.core.presenter.model.DsDescriptorManager;

public class AbstractDsService<M extends AbstractDsModel<?>, P extends IDsParam, E> 
		extends AbstractDsProcessor {
 
	protected boolean noInsert = false;
	protected boolean noUpdate = false;
	protected boolean noDelete = false;
	
	
	protected Class<M> modelClass;
	protected Class<P> paramClass;
	protected Class<E> entityClass;
	protected Class<?> converterClass; //? extends AbstractDsConverter<M, E>
 
	protected IDsDescriptor descriptor;
	
	protected IDsConverter<M, E> converter;
	//private List<IEntityServiceFactory> entityServiceFactories;
	private Map<String, Class<AbstractDsDelegate<M>>> rpcData = new HashMap<String, Class<AbstractDsDelegate<M>>>();
	private Map<String, Class<AbstractDsDelegate<M>>> rpcFilter = new HashMap<String, Class<AbstractDsDelegate<M>>>();
	
	
	// ======================== Find ===========================
	
	public Long count(M filter, P params,
			IQueryBuilder<M, P> builder) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
	
	protected void preFind(M filter, P params,
			IQueryBuilder<M, P> builder) throws Exception{
	}
	
	public List<M> find(M filter, P params,
			IQueryBuilder<M, P> builder) throws Exception {
		QueryBuilderWithJpql<M, P> bld = (QueryBuilderWithJpql<M, P>) builder;
		
		bld.setFilter(filter);
		bld.setParams(params);
		 
		List<M> result = new ArrayList<M>(); 
				 
		List<E> list = bld.createQuery().getResultList();		
		for(E e : list) {
			M m = this.getModelClass().newInstance();
			this.getConverter().entityToModel(e, m);
			result.add(m);
		}		
		return result;
	}
	
	protected void postFind(M filter, P params,
			IQueryBuilder<M, P> builder) throws Exception{
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
	protected void postInsertBeforeModel(M ds, E e) throws Exception{
	}
	/**
	 * Post-insert event. The entity has been persisted by the <code>entityManager</code>, 
	 * and the possible changes which might alter the entity during its persist phase 
	 * are applied to the data-source.  
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void postInsertAfterModel(M ds, E e) throws Exception{
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
		// add the client 
		if(ds instanceof IModelWithClientId) {
			((IModelWithClientId)ds).setClientId(Session.user.get().getClientId());
		}
		this.preInsert(ds);
		E e = (E)this.getEntityService().create();		 
		this.getConverter().modelToEntity(ds, e);
		this.preInsert(ds,e);
		this.getEntityService().insert(e);
		postInsertBeforeModel(ds, e);
		this.getConverter().entityToModel(e, ds);
		postInsertAfterModel(ds, e);
	}
	
	/**
	 * Template method for <code>pre-insert</code>.
	 * @param list
	 * @throws Exception
	 */
	public void preInsert(List<M> list) throws Exception {
		 
	}
	
	public void insert(List<M> list) throws Exception {
		if (this.noInsert) {
			throw new ActionNotSupportedException("Insert not allowed.");
		} 	
		// add the client 
		for(M ds: list) {
			if(ds instanceof IModelWithClientId) {
				((IModelWithClientId)ds).setClientId(Session.user.get().getClientId());
			}
		}
		this.preInsert(list);
		// add entities in a queue and then try to insert them all in one transaction
		List<E> entities = new ArrayList<E>();
		for(M ds: list) {
			this.preInsert(ds);
			E e = (E)this.getEntityService().create();			
			entities.add(e);
			((AbstractDsModel<E>) ds)._setEntity_(e);
			this.getConverter().modelToEntity(ds, e);
			this.preInsert(ds,e);			
		}	
		this.getEntityService().insert(entities);
		for(M ds: list) {	
			E e = ((AbstractDsModel<E>) ds)._getEntity_();
			postInsertBeforeModel(ds, e);
			this.getConverter().entityToModel(e, ds);
			postInsertAfterModel(ds, e);
		}			
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
	protected void postUpdateBeforeModel(M ds, E e) throws Exception{
	}
	
	/**
	 * Post-update event. The entity has been merged by the <code>entityManager</code>, 
	 * and the possible changes which might alter the entity during its merging phase 
	 * are applied to the data-source.  
	 * @param ds
	 * @param e
	 * @throws Exception
	 */
	protected void postUpdateAfterModel(M ds, E e) throws Exception{
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
		if (this.noUpdate) {
			throw new ActionNotSupportedException("Update not allowed.");
		}
		
		this.preUpdate(ds);
		E e = (E)this.getEntityService().findById(((IModelWithId)ds).getId());	
		this.preUpdateBeforeEntity(ds, e);
		this.getConverter().modelToEntity(ds, e);
		this.preUpdateAfterEntity(ds, e);
		this.getEntityService().update(e);
		postUpdateBeforeModel(ds, e);		
		this.getConverter().entityToModel(e, ds);
		postUpdateAfterModel(ds, e);	
	}
	
	/**
	 * Template method for <code>pre-update</code>.
	 * @param list
	 * @throws Exception
	 */
	public void preUpdate(List<M> list) throws Exception {		 
	}
	
	
	public void update(List<M> list) throws Exception {
		if (this.noUpdate) {
			throw new ActionNotSupportedException("Update not allowed.");
		} 		 
		this.preUpdate(list);
		// add entities in a queue and then try to insert them all in one transaction
		// find the entities
		
		List<E> entities = this.getEntityService().findByIds(this.collectIds(list));

		for(M ds: list) {
			this.preUpdate(ds);
			//TODO: optimize me 
			E e = lookupEntityById(entities, ((IModelWithId)ds).getId() );
			//E e = this.getEntityService().getEntityManager().find(this.getEntityClass(), ((IModelWithId)ds).getId());
			
			//((AbstractDsModel<E>) ds)._setEntity_(e);
			this.preUpdateBeforeEntity(ds, e);			
			this.getConverter().modelToEntity(ds, e);
			this.preUpdateAfterEntity(ds, e);			 
		}	
		System.out.println("--------AbstractDsService.update before this.getEntityService().update(entities)");
		this.getEntityService().update(entities);
		System.out.println("--------AbstractDsService.update after this.getEntityService().update(entities)");
		//entities = this.getEntityService().findByIds(this.collectIds(list));
		for(M ds: list) {	
			//E e = ((AbstractDsModel<E>) ds)._getEntity_();
			E e = this.getEntityService().getEntityManager().find(this.getEntityClass(), ((IModelWithId)ds).getId());
			//this.getEntityService().getEntityManager().refresh(e);
			postUpdateBeforeModel(ds, e);
			this.getConverter().entityToModel(e, ds);
			postUpdateAfterModel(ds, e);
		}					
		this.postUpdate(list);
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
	
	
	// ======================== Import/Export ===========================
	
	public void doImport(String absoluteFileName) throws Exception {
		this.doImport( new File(absoluteFileName) );
	}
	public void doImport(String relativeFileName, String path) throws Exception {
		this.doImport( new File(path + "/"+ relativeFileName ) );
	}
	
	private void doImport(File file) throws Exception {
		//TODO: check type-> csv, json, etc
		DsCsvLoader l = new DsCsvLoader();
		List<M> list = l.run(file, this.modelClass, null);
		this.insert(list);
	}
	
	public void doExport(M filter, P params,
			IQueryBuilder<M, P> builder, IExportWriter writer) throws Exception {

	}
	
	// ======================== RPC ===========================
	
	public void rpcData(String procedureName, M ds, P params) throws Exception {
		if (!rpcData.containsKey(procedureName)) {
			throw new Exception("No such procedure defined: "+procedureName);
		}
		AbstractDsDelegate<M> delegate = rpcData.get(procedureName).newInstance();
		delegate.setAppContext(this.appContext);
		delegate.setEntityServiceFactories(entityServiceFactories);
		delegate.setDsServiceFactories(dsServiceFactories);
		delegate.execute(ds);		
	}

	public void rpcFilter(String procedureName, M filter, P params) throws Exception {
		if (!rpcFilter.containsKey(procedureName)) {
			throw new Exception("No such procedure defined: "+procedureName);
		}
		AbstractDsDelegate<M> delegate = rpcFilter.get(procedureName).newInstance();
		delegate.setAppContext(this.appContext);
		delegate.setEntityServiceFactories(entityServiceFactories);
		delegate.setDsServiceFactories(dsServiceFactories);
		delegate.execute(filter);		
	}
	
	public void rpcData(String procedureName, List<M> list, P params) throws Exception {
		Method m = this.getClass().getMethod("execute" + procedureName,
				List.class);
		m.invoke(this, list);
	}
	

	// ======================== Getters-setters ===========================
 
	public Class<E> getEntityClass() {
		return entityClass;
	}
 
	public void setEntityClass(Class<E> entityClass) {
		this.entityClass = entityClass;
	}

	public Class<M> getModelClass() {
		return modelClass;
	}

	public void setModelClass(Class<M> modelClass) throws Exception {
		this.modelClass = modelClass;
		this.descriptor = DsDescriptorManager.get(this.modelClass);
	}

	public Class<P> getParamClass() {
		if (this.paramClass == null) {
			//this.paramClass = EmptyParam.class;
		}
		return paramClass;
	}

	public void setParamClass(Class<P> paramClass) {
		this.paramClass = paramClass;
	}

	public Class<?> getConverterClass() {
		return converterClass;
	}

	public void setConverterClass(Class<?> converterClass) {
		this.converterClass = converterClass;
	}
	
	protected IDsConverter<M, E> getConverter() throws Exception {
		if (this.converter == null) {
			if (this.converterClass == null ) {
				this.converterClass = BaseDsConverter.class;
			}
			this.converter = (IDsConverter)this.converterClass.newInstance();
			this.converter.setEntityManager(this.getEntityService().getEntityManager());
			this.converter.setEntityServiceFactories(this.entityServiceFactories);
		}
		return this.converter;
	} 	
	public void setConverter(IDsConverter<M, E> converter) {
		this.converter = converter;
	}
	 
	public void setDescriptor(IDsDescriptor descriptor) {
		this.descriptor = descriptor;
	}
	
	public IDsDescriptor getDescriptor() {
		return descriptor;
	}
	
	@Override
	public IEntityService getEntityService() throws Exception {	
		if ( this.entityService == null) {
			this.entityService = this.findEntityService(this.getEntityClass());
		}		
		return this.entityService;
	}
	 
	
	
	// ======================== Helpers ===========================
	 
	public Map<String, Class<AbstractDsDelegate<M>>> getRpcData() {
		return rpcData;
	}

	public void setRpcData(
			Map<String, Class<AbstractDsDelegate<M>>> rpcData) {
		this.rpcData = rpcData;
	}

	 
	public Map<String, Class<AbstractDsDelegate<M>>> getRpcFilter() {
		return rpcFilter;
	}

	public void setRpcFilter(
			Map<String, Class<AbstractDsDelegate<M>>> rpcFilter) {
		this.rpcFilter = rpcFilter;
	}

	protected List<Object> collectIds(List<M> list) {
		List<Object> ids = new ArrayList<Object>();
		for (M ds: list) {
			ids.add( ((IModelWithId)ds).getId());
		}
		return ids;
	}
 
	public IQueryBuilder<M,P> createQueryBuilder() throws Exception {
		QueryBuilderWithJpql<M,P> qb = new QueryBuilderWithJpql<M,P>();
		qb.setFilterClass(this.getModelClass());
		qb.setParamClass(this.getParamClass());
		qb.setDescriptor(this.descriptor);
		//TODO: correct this
		qb.setEntityManager(this.getEntityService().getEntityManager());
		qb.setBaseEql("select e from "+this.getEntityClass().getSimpleName()+" e");
		return qb;	 
	}

	public IDsMarshaller<M, P> createMarshaller(
			String dataFormat) throws Exception {
		IDsMarshaller<M, P>  marshaller = null;
		if (dataFormat.equals(IDsMarshaller.JSON)) {
			marshaller = new JsonMarshaller<M, P>(this.modelClass,
					this.paramClass);
		}		 
		return marshaller;
	}
	
}
