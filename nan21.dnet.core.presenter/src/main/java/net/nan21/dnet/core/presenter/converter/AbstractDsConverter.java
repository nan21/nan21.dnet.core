package net.nan21.dnet.core.presenter.converter;

import java.lang.reflect.Method;
import java.util.Map;
 
import javax.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.util.StringUtils;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.converter.IDsConverter;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.presenter.model.DsDescriptor;
import net.nan21.dnet.core.presenter.service.ServiceLocator;

public abstract class AbstractDsConverter<M, E> implements IDsConverter<M, E>{

	@Autowired
	protected ApplicationContext appContext;

	@Autowired
	private ISystemConfig systemConfig;
	 
	@Autowired
	private ServiceLocator serviceLocator;
	
	protected EntityManager em;	
	
	protected ExpressionParser parser;
	
	protected DsDescriptor<M> descriptor;
	
	protected Class<M> modelClass;
	
	protected Class<E> entityClass;
	
	public AbstractDsConverter() {
		this.parser = new SpelExpressionParser();
	}
	
	 
	public void entityToModel(E e, M m) throws Exception {
		
		StandardEvaluationContext context = new StandardEvaluationContext(e);
		Map<String, String> refpaths = this.descriptor.getE2mConv();
		Method[] methods = this.getModelClass().getMethods();
		for (Method method : methods) {
			if (!method.getName().equals("set__clientRecordId__") && method.getName().startsWith("set")) {
				String fn = StringUtils.uncapitalize(method.getName().substring(3));
				try {
					method.invoke(m, parser.parseExpression(refpaths.get(fn)).getValue(context));
				} catch(Exception exc) {
					
				}				
			}		 	
		}	
	}
	 
	
	public void modelToEntity(M m, E e) throws Exception  {
		this.modelToEntityAttributes(m, e);
		this.modelToEntityReferences(m, e);
	}
	
	
	protected void modelToEntityAttributes(M m, E e)  throws Exception  {
		StandardEvaluationContext context = new StandardEvaluationContext(m);
		Map<String, String> attrmap = this.descriptor.getM2eConv();
		Method[] methods = this.getEntityClass().getMethods();
		for (Method method : methods) {
			if (method.getName().startsWith("set")) {
				String fn = StringUtils.uncapitalize(method.getName().substring(3));
				if (attrmap.containsKey(fn)) {
					try {
						method.invoke(e, parser.parseExpression(attrmap.get(fn)).getValue(context));
					} catch(Exception exc) {
						
					}
				}
			}		 	
		}			
	}
	
	protected void modelToEntityReferences(M m, E e)  throws Exception  {
		 	
	}

	 
	
	/**
	 * Lookup an entity service.
	 * @param <E>
	 * @param entityClass
	 * @return
	 * @throws Exception
	 */
	public <T> IEntityService<T> findEntityService(Class<T> entityClass)
			throws Exception {
		return this.getServiceLocator().findEntityService(entityClass);
	}
 
	public EntityManager getEntityManager() {
		return this.em;
	}

	public void setEntityManager(EntityManager em) {
		this.em = em;
	}
	 
	/**
	 * Get the data-source class.
	 * @return
	 */
	public Class<M> getModelClass() {
		return this.modelClass;
	}
	 
	/**
	 * Set the data-source class.
	 * @param clazz
	 */
	public void setModelClass(Class<M> clazz) {
		this.modelClass = clazz;
	}
	
	/**
	 * Get the entity class.
	 * @return
	 */
	public Class<E> getEntityClass() {
		return entityClass;
	}
 
	/**
	 * Set the entity class.
	 * @param entityClass
	 */
	public void setEntityClass(Class<E> entityClass) {
		this.entityClass = entityClass;
	}

 
	/**
	 * Set the data-source descriptor.
	 * @param descriptor
	 */
	public void setDescriptor(DsDescriptor<M> descriptor) {
		this.descriptor = descriptor;
	}
	
	
	/**
	 * Get the data-source descriptor.
	 * @return
	 */
	public DsDescriptor<M> getDescriptor() {
		return descriptor;
	}
	
	

	/**
	 * Get application context.
	 * @return
	 */
	public ApplicationContext getAppContext() {
		return appContext;
	}

	/**
	 * Set application context.
	 * @param appContext
	 */
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

	/**
	 * Get system configuration object. If it is null attempts to retrieve it
	 * from Spring context.
	 * @return
	 */
	public ISystemConfig getSystemConfig() {
		if (this.systemConfig == null) {
			this.systemConfig = this.appContext.getBean(ISystemConfig.class);
		}
		return systemConfig;
	}

	/**
	 * Set system configuration object
	 * @param systemConfig
	 */
	public void setSystemConfig(ISystemConfig systemConfig) {
		this.systemConfig = systemConfig;
	}
	
	/**
	 * Get presenter service locator. If it is null attempts to retrieve it
	 * from Spring context.
	 * @return
	 */
	public ServiceLocator getServiceLocator()  {
		if (this.serviceLocator == null) {
			this.serviceLocator = this.appContext.getBean(ServiceLocator.class);
		}
		return serviceLocator;
	}

	/**
	 * Set presenter service locator.
	 * @param serviceLocator
	 */
	public void setServiceLocator(ServiceLocator serviceLocator) {
		this.serviceLocator = serviceLocator;
	}
	
}
