package net.nan21.dnet.core.presenter.converter;

import java.lang.reflect.Method;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.util.StringUtils;

import net.nan21.dnet.core.api.converter.IDsConverter;
import net.nan21.dnet.core.api.descriptor.IViewModelDescriptor;
import net.nan21.dnet.core.api.service.IEntityService;
import net.nan21.dnet.core.api.service.IEntityServiceFactory;
import net.nan21.dnet.core.presenter.model.DsDescriptor;

public abstract class AbstractDsConverter<M, E> implements IDsConverter<M, E>{

	protected EntityManager em;
	private List<IEntityServiceFactory> entityServiceFactories;
	ExpressionParser parser;
	protected DsDescriptor<M> descriptor;
	protected Class<M> modelClass;
	protected Class<E> entityClass;
	
	public AbstractDsConverter() {
		this.parser = new SpelExpressionParser();
	}
	
	
	
	
	public void entityToModel(E e, M m) throws Exception {
		StandardEvaluationContext context = new StandardEvaluationContext(e);
//		this.entityToModelAttributes(e, m, context);
//		this.entityToModelReferences(e, m, context);
		Map<String, String> refpaths = this.descriptor.getRefPaths();
		Method[] methods = this.getModelClass().getDeclaredMethods();
		for (Method method : methods) {
			if (method.getName().startsWith("set")) {
				String fn = StringUtils.uncapitalize(method.getName().substring(3));
				try {
					method.invoke(m, parser.parseExpression(refpaths.get(fn)).getValue(context));
				} catch(Exception exc) {
					
				}
				
			}		 	
		}	
	}
	protected void entityToModelAttributes(E e, M m, StandardEvaluationContext context) throws Exception {	 
	}
	protected void entityToModelReferences(E e, M m, StandardEvaluationContext context)  throws Exception {		 
	} 
	
	public void modelToEntity(M m, E e) throws Exception  {
		this.modelToEntityAttributes(m, e);
		this.modelToEntityReferences(m, e);
	}
	protected void modelToEntityAttributes(M m, E e)  throws Exception  {
		StandardEvaluationContext context = new StandardEvaluationContext(m);
		Map<String, String> attrmap = this.descriptor.getAttributeMap();
		Method[] methods = this.getEntityClass().getDeclaredMethods();
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

	
	protected IEntityService<?> getService(Class<? extends IEntityService<?>> service) throws Exception {
		
		//TODO: enhance to use a bundleID instead of iterating 
		//through all the available entityServiceFactories
		// extract it .. -> See also AbstractDsConverter
		
		for(IEntityServiceFactory esf: entityServiceFactories) {
			try {
				IEntityService<?> es = esf.create(service);
				if (es != null) {
					 
					return es;
				}					
			} catch(NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore 		
			}				
		}
		throw new Exception (service.getCanonicalName() + " not found ");

	}
	
	public EntityManager getEntityManager() {
		return this.em;
	}

	public void setEntityManager(EntityManager em) {
		this.em = em;
	}
	public List<IEntityServiceFactory> getEntityServiceFactories() {
		return entityServiceFactories;
	}
	public void setEntityServiceFactories(
			List<IEntityServiceFactory> entityServiceFactories) {
		this.entityServiceFactories = entityServiceFactories;
	}
	
	public Class<M> getModelClass() {
		return this.modelClass;
	}
	 
	public void setModelClass(Class<M> clazz) {
		this.modelClass = clazz;
	}
	
	
	public Class<E> getEntityClass() {
		return entityClass;
	}
 
	public void setEntityClass(Class<E> entityClass) {
		this.entityClass = entityClass;
	}




	public void setDescriptor(DsDescriptor<M> descriptor) {
		this.descriptor = descriptor;
	}
	
	public DsDescriptor<M> getDescriptor() {
		return descriptor;
	}
	
}
