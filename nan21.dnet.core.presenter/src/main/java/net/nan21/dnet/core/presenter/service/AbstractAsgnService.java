package net.nan21.dnet.core.presenter.service;

import java.util.ArrayList;
import java.util.List;

import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;
import net.nan21.dnet.core.api.service.IAsgnTxService;
import net.nan21.dnet.core.api.service.IAsgnTxServiceFactory;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;
import net.nan21.dnet.core.domain.service.AbstractAsgnTxService;
import net.nan21.dnet.core.domain.service.BaseAsgnTxService;
import net.nan21.dnet.core.presenter.action.QueryBuilderWithJpql;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public abstract class AbstractAsgnService<M, P, E> {
	@Autowired
	protected ApplicationContext appContext;
	  
	private Class<M> modelClass;
	private Class<P> paramClass;
	
	protected String selectionId;
	protected Long objectId;
	
	protected String leftTable;
	protected String rightTable;
	protected String leftPkField;
	protected String rightObjectIdField;
	protected String rightItemIdField;
	
	protected List<IAsgnTxServiceFactory> asgnTxServiceFactories;
	/**
	 * Delegate service in business layer to perform transactions. 
	 */
	private IAsgnTxService txService;
	

	//TODO: this becomes findasgTxService 
	private IAsgnTxService findTxService() throws Exception {
		for(IAsgnTxServiceFactory f: asgnTxServiceFactories) {
			try {
				IAsgnTxService es = f.create( "baseAsgnTxService" ); //this.getEntityClass()
				if (es != null) {
					//this.entityService = es;
					es.setObjectId(objectId);
					es.setSelectionId(selectionId);
					
					 
					this.leftTable = "BD_ROLES";
			        this.rightTable = "BD_USERS_ROLES";
			        //this.saveAsSqlInsert = true;

			        this.leftPkField = "id";
			        this.rightItemIdField = "ROLES_ID";
			        this.rightObjectIdField = "USERS_ID";
			        
					es.setLeftTable(leftTable);
					es.setRightItemIdField(rightItemIdField);
					es.setRightTable(rightTable);
					es.setRightObjectIdField(rightObjectIdField);
					
					return es;
				}					
			} catch(NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore 		
			}				
		}
		throw new Exception (  "Transactional assignement service not found ");
 
	}
	
	public IAsgnTxService getTxService() throws Exception {
		if(this.txService == null) {
			this.txService =  this.findTxService();
		}
		return this.txService;
	}

	public void setTxService(IAsgnTxService txService) {
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
		// TODO Auto-generated method stub
		
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
		
		bld.setFilter(filter);
		bld.setParams(params);
		 
		List<M> result = new ArrayList<M>(); 
				 
		List<E> list = bld.createQuery()
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
		
		bld.setFilter(filter);
		bld.setParams(params);
		 
		List<M> result = new ArrayList<M>(); 
				 
		List<E> list = bld.createQuery()
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
		return null;
	}


	public Long countRight(M filter, P params, IQueryBuilder<M, P> builder)
			throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
	
	public IDsMarshaller<M, P> createMarshaller(String dataFormat)
			throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	public IQueryBuilder<M, P> createQueryBuilder() throws Exception {
		QueryBuilderWithJpql<M,P> qb = new QueryBuilderWithJpql<M,P>();
		qb.setFilterClass(this.getModelClass());
		qb.setParamClass(this.getParamClass());
		//qb.setDescriptor(this.descriptor);	 
		qb.setEntityManager(this.getTxService().getEntityManager());
		 
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

	public void setModelClass(Class<M> modelClass) {
		this.modelClass = modelClass;
	}

	public Class<P> getParamClass() {
		return paramClass;
	}

	public void setParamClass(Class<P> paramClass) {
		this.paramClass = paramClass;
	}

	public List<IAsgnTxServiceFactory> getAsgnTxServiceFactories() {
		return asgnTxServiceFactories;
	}

	public void setAsgnTxServiceFactories(
			List<IAsgnTxServiceFactory> asgnTxServiceFactories) {
		this.asgnTxServiceFactories = asgnTxServiceFactories;
	}
	
	
}
