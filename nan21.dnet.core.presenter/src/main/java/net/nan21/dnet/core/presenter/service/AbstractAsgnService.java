package net.nan21.dnet.core.presenter.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Query;

import net.nan21.dnet.core.api.SystemConfig;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.service.IAsgnTxService;
import net.nan21.dnet.core.api.service.IAsgnTxServiceFactory;
import net.nan21.dnet.core.api.session.Session;
import net.nan21.dnet.core.presenter.action.QueryBuilderWithJpql;
import net.nan21.dnet.core.presenter.marshaller.JsonMarshaller;
import net.nan21.dnet.core.presenter.model.AsgnDescriptor;
import net.nan21.dnet.core.presenter.model.ViewModelDescriptorManager;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public abstract class AbstractAsgnService<M, P, E> {
	@Autowired
	protected ApplicationContext appContext;
	  
	private Class<M> modelClass;
	private Class<P> paramClass;
	private Class<E> entityClass;
	
	protected AsgnDescriptor<M> descriptor;
	
	protected String selectionId;
	protected Long objectId;
	
	protected String leftTable;
	protected String rightTable;
	protected String leftPkField = "id";
	protected String rightObjectIdField;
	protected String rightItemIdField;
	protected SystemConfig systemConfig;
	protected String asgnTxFactoryName;
	
	protected List<IAsgnTxServiceFactory> asgnTxServiceFactories;
	/**
	 * Delegate service in business layer to perform transactions. 
	 */
	private IAsgnTxService<E> txService;
	

	//TODO: this becomes findasgTxService 
	private IAsgnTxService<E> findTxService() throws Exception {
		for(IAsgnTxServiceFactory f: asgnTxServiceFactories) {
			if (this.asgnTxFactoryName != null && this.asgnTxFactoryName.equals(f.getName())) {
				try {
					IAsgnTxService<E> es = f.create( "baseAsgnTxService" ); //this.getEntityClass()
					if (es != null) {
						//this.entityService = es;
						es.setEntityClass(entityClass); 
						es.setObjectId(objectId);
						es.setSelectionId(selectionId);
						  
						es.setLeftTable(leftTable);
						es.setRightItemIdField(rightItemIdField);
						es.setRightTable(rightTable);
						es.setRightObjectIdField(rightObjectIdField);
						es.setLeftPkField(leftPkField);
						return es;
					}					
				} catch(NoSuchBeanDefinitionException e) {
					// service not found in this factory, ignore 		
				}	
			}
		}
		throw new Exception (  "Transactional assignement service not found ");
 
	}
	
	public IAsgnTxService<E> getTxService() throws Exception {
		if(this.txService == null) {
			this.txService =  this.findTxService();
		}
		return this.txService;
	}

	public void setTxService(IAsgnTxService<E> txService) {
		this.txService = txService;
	}
	
	/**
	 * Add the specified list of IDs to the selected ones.
	 * 
	 * @param ids
	 * @throws Exception
	 */ 
	public void moveRight(List<Long> ids) throws Exception {
		this.getTxService().moveRight(ids);
	}
	
	
	
	/**
	 * Add all the available values to the selected ones.
	 * 
	 * @throws Exception
	 */
	public void moveRightAll() throws Exception {
		this.getTxService().moveRightAll();
	}
	
	/**
	 * Remove the specified list of IDs from the selected ones.
	 * 
	 * @param ids
	 * @throws Exception
	 */
	public void moveLeft(List<Long> ids) throws Exception {
		this.getTxService().moveLeft(ids);
	}
	
	/**
	 * Remove all the selected values.
	 * 
	 * @throws Exception
	 */
	public void moveLeftAll() throws Exception {
		this.getTxService().moveLeftAll();
	}

	 
	public void save() throws Exception {
		this.getTxService().save();
	}
	
	/**
	 * Initialize the component's temporary workspace. 
	 * 
	 * @return the UUID of the selection
	 * @throws Exception
	 */
	public String setup(String asgnName) throws Exception {		 
		return this.getTxService().setup(asgnName);
	}
	
	
	/**
	 * Clean-up the temporary selections.
	 * 
	 * @throws Exception
	 */
	public void cleanup() throws Exception {
		this.getTxService().cleanup();
	}
	
	/**
	 * Restores all the changes made by the user to
	 * the initial state.
	 * 
	 * @throws Exception
	 */
	public void reset() throws Exception {
		this.getTxService().reset();
	}
	
	
	public List<M> findLeft(M filter, P params,
			IQueryBuilder<M, P> builder) throws Exception {
		QueryBuilderWithJpql<M, P> bld = (QueryBuilderWithJpql<M, P>) builder;		
		
		bld.addFilterCondition(" e.clientId = :pClientId and e."+this.leftPkField+" not in (select x.itemId from TempAsgnLine x where x.selectionId = :pSelectionId)"); 
		
		bld.setFilter(filter);
		bld.setParams(params);
		 
		List<M> result = new ArrayList<M>(); 
		Query q = bld.createQuery();	
		q.setParameter("pClientId", Session.user.get().getClientId());
		q.setParameter("pSelectionId", this.selectionId);
		List<E> list = q
			.setFirstResult(bld.getResultStart())
			.setMaxResults(bld.getResultSize())
			.getResultList();		
		for(E e : list) {
			M m = this.getModelClass().newInstance();
			BeanUtils.copyProperties(e, m);			 
			result.add(m);
		}		
		return result;
	}
	
	public List<M> findRight(M filter, P params,
			IQueryBuilder<M, P> builder) throws Exception {
		QueryBuilderWithJpql<M, P> bld = (QueryBuilderWithJpql<M, P>) builder;
  
		bld.addFilterCondition(" e.clientId = :pClientId and e."+this.leftPkField+" in (select x.itemId from TempAsgnLine x where x.selectionId = :pSelectionId)"); 
		bld.setFilter(filter);
		bld.setParams(params);
		 
		List<M> result = new ArrayList<M>(); 
				 
		Query q = bld.createQuery();	
		q.setParameter("pClientId", Session.user.get().getClientId());
		q.setParameter("pSelectionId", this.selectionId);
		List<E> list = q
			.setFirstResult(bld.getResultStart())
			.setMaxResults(bld.getResultSize())
			.getResultList();		
		for(E e : list) {
			M m = this.getModelClass().newInstance();
			BeanUtils.copyProperties(e, m);			 
			result.add(m);
		}		
		return result;
	}
	
	public Long countLeft(M filter, P params, IQueryBuilder<M, P> builder)
			throws Exception {
		// TODO Auto-generated method stub
		return 10L;
	}


	public Long countRight(M filter, P params, IQueryBuilder<M, P> builder)
			throws Exception {
		// TODO Auto-generated method stub
		return 10L;
	}
	
	public IDsMarshaller<M, P> createMarshaller(String dataFormat)
			throws Exception {
		IDsMarshaller<M, P>  marshaller = null;
		if (dataFormat.equals(IDsMarshaller.JSON)) {
			marshaller = new JsonMarshaller<M, P>(this.modelClass,
					this.paramClass);
		}		 
		return marshaller;
	}

	public IQueryBuilder<M, P> createQueryBuilder() throws Exception {
		QueryBuilderWithJpql<M,P> qb = new QueryBuilderWithJpql<M,P>();
		qb.setFilterClass(this.getModelClass());
		qb.setParamClass(this.getParamClass());
		qb.setDescriptor(this.descriptor);	 
		qb.setEntityManager(this.getTxService().getEntityManager());
		qb.setSystemConfig(this.systemConfig); 
		if(qb instanceof QueryBuilderWithJpql) {
			QueryBuilderWithJpql jqb = (QueryBuilderWithJpql)qb;			
			jqb.setBaseEql("select e from "+this.getEntityClass().getSimpleName()+" e");
			jqb.setBaseEqlCount("select count(1) from "+this.getEntityClass().getSimpleName()+" e");
			
			jqb.setBaseEql("select e from "+this.entityClass.getSimpleName()+" e");
			jqb.setBaseEqlCount("select count(1) from "+this.entityClass.getSimpleName()+" e");
			 
			if(this.descriptor.isWorksWithJpql()) {
				jqb.setDefaultWhere(this.descriptor.getJpqlDefaultWhere() );
				jqb.setDefaultSort(this.descriptor.getJpqlDefaultSort());
			}
		}
		 
		return qb;	
	}
 
	// ====================  getters- setters =====================
	
	public String getSelectionId() {
		return selectionId;
	}

	public void setSelectionId(String selectionId) {
		this.selectionId = selectionId;
	}

	public Long getObjectId() {
		return objectId;
	}

	public void setObjectId(Long objectId) {
		this.objectId = objectId;
	}
	
	public ApplicationContext getAppContext() {
		return appContext;
	}
 
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

	public Class<M> getModelClass() {
		return modelClass;
	}

	public void setModelClass(Class<M> modelClass) throws Exception {
		this.modelClass = modelClass;
		this.descriptor = ViewModelDescriptorManager.getAsgnDescriptor(this.modelClass);
	}

	public Class<P> getParamClass() {
		return paramClass;
	}

	public void setParamClass(Class<P> paramClass) {
		this.paramClass = paramClass;
	}
 
	public Class<E> getEntityClass() {
		return entityClass;
	}

	public void setEntityClass(Class<E> entityClass) {
		this.entityClass = entityClass;
	}

	public List<IAsgnTxServiceFactory> getAsgnTxServiceFactories() {
		return asgnTxServiceFactories;
	}

	public void setAsgnTxServiceFactories(
			List<IAsgnTxServiceFactory> asgnTxServiceFactories) {
		this.asgnTxServiceFactories = asgnTxServiceFactories;
	}

	public String getLeftTable() {
		return leftTable;
	}

	public void setLeftTable(String leftTable) {
		this.leftTable = leftTable;
	}

	public String getRightTable() {
		return rightTable;
	}

	public void setRightTable(String rightTable) {
		this.rightTable = rightTable;
	}

	public String getLeftPkField() {
		return leftPkField;
	}

	public void setLeftPkField(String leftPkField) {
		this.leftPkField = leftPkField;
	}

	public String getRightObjectIdField() {
		return rightObjectIdField;
	}

	public void setRightObjectIdField(String rightObjectIdField) {
		this.rightObjectIdField = rightObjectIdField;
	}

	public String getRightItemIdField() {
		return rightItemIdField;
	}

	public void setRightItemIdField(String rightItemIdField) {
		this.rightItemIdField = rightItemIdField;
	}

	public String getAsgnTxFactoryName() {
		return asgnTxFactoryName;
	}

	public void setAsgnTxFactoryName(String asgnTxFactoryName) {
		this.asgnTxFactoryName = asgnTxFactoryName;
	}
	
	public SystemConfig getSystemConfig() {
		return systemConfig;
	}

	public void setSystemConfig(SystemConfig systemConfig) {
		this.systemConfig = systemConfig;
	}
}
