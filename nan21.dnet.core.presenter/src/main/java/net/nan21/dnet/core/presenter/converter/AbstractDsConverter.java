package net.nan21.dnet.core.presenter.converter;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.util.StringUtils;

import net.nan21.dnet.core.api.annotation.RefLookups;
import net.nan21.dnet.core.api.converter.IDsConverter;
import net.nan21.dnet.core.presenter.AbstractPresenterBase;
import net.nan21.dnet.core.presenter.model.DsDescriptor;

public abstract class AbstractDsConverter<M, E> extends AbstractPresenterBase
		implements IDsConverter<M, E> {

	protected EntityManager em;

	private ExpressionParser parser;

	private DsDescriptor<M> descriptor;

	private Class<M> modelClass;

	private Class<E> entityClass;

	public AbstractDsConverter() {
		this.parser = new SpelExpressionParser();
	}

	public void entityToModel(E e, M m) throws Exception {

		StandardEvaluationContext context = new StandardEvaluationContext(e);
		Map<String, String> refpaths = this.descriptor.getE2mConv();
		Method[] methods = this.getModelClass().getMethods();
		for (Method method : methods) {
			if (method.getName().startsWith("set")
					&& !method.getName().equals("set__clientRecordId__")) {
				String fn = StringUtils.uncapitalize(method.getName()
						.substring(3));
				try {
					method.invoke(m, parser.parseExpression(refpaths.get(fn))
							.getValue(context));
				} catch (Exception exc) {

				}
			}
		}
	}

	public void modelToEntity(M m, E e, boolean isInsert) throws Exception {
		this.modelToEntityAttributes(m, e, isInsert);
		this.modelToEntityReferences(m, e, isInsert);
	}

	protected void modelToEntityAttributes(M m, E e, boolean isInsert)
			throws Exception {
		StandardEvaluationContext context = new StandardEvaluationContext(m);
		Map<String, String> attrmap = this.descriptor.getM2eConv();
		Method[] methods = this.getEntityClass().getMethods();

		List<String> noInserts = this.descriptor.getNoInserts();
		List<String> noUpdates = this.descriptor.getNoUpdates();

		for (Method method : methods) {
			if (method.getName().startsWith("set")) {
				String fn = StringUtils.uncapitalize(method.getName()
						.substring(3));
				boolean doit = true;
				if (attrmap.containsKey(fn)) {
					String dsf = attrmap.get(fn);
					if (isInsert && noInserts.contains(fn)) {
						doit = false;
					}
					if (!isInsert && noUpdates.contains(fn)) {
						doit = false;
					}

					try {
						if (doit) {
							method.invoke(e, parser.parseExpression(dsf)
									.getValue(context));
						}
					} catch (Exception exc) {

					}
				}
			}
		}
	}

	protected void modelToEntityReferences(M m, E e, boolean isInsert)
			throws Exception {
		if (this.getModelClass().isAnnotationPresent(RefLookups.class)) {

			ReflookupResolver<M, E> resolver = new ReflookupResolver<M, E>(
					this.modelClass, this.entityClass, m, e, isInsert, this.em);
			resolver.setApplicationContext(this.getApplicationContext());
			resolver.execute();
		}
	}

	public EntityManager getEntityManager() {
		return this.em;
	}

	public void setEntityManager(EntityManager em) {
		this.em = em;
	}

	/**
	 * Get the data-source class.
	 * 
	 * @return
	 */
	public Class<M> getModelClass() {
		return this.modelClass;
	}

	/**
	 * Set the data-source class.
	 * 
	 * @param clazz
	 */
	public void setModelClass(Class<M> clazz) {
		this.modelClass = clazz;
	}

	/**
	 * Get the entity class.
	 * 
	 * @return
	 */
	public Class<E> getEntityClass() {
		return entityClass;
	}

	/**
	 * Set the entity class.
	 * 
	 * @param entityClass
	 */
	public void setEntityClass(Class<E> entityClass) {
		this.entityClass = entityClass;
	}

	/**
	 * Set the data-source descriptor.
	 * 
	 * @param descriptor
	 */
	public void setDescriptor(DsDescriptor<M> descriptor) {
		this.descriptor = descriptor;
	}

	/**
	 * Get the data-source descriptor.
	 * 
	 * @return
	 */
	public DsDescriptor<M> getDescriptor() {
		return descriptor;
	}

}
