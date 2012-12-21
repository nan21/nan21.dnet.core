package net.nan21.dnet.core.presenter.converter;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;

import org.springframework.util.StringUtils;

import net.nan21.dnet.core.api.annotation.DsField;
import net.nan21.dnet.core.api.annotation.Param;
import net.nan21.dnet.core.api.annotation.RefLookup;
import net.nan21.dnet.core.api.annotation.RefLookups;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.presenter.AbstractPresenterBase;

/**
 * Delegate class to update the entity references from the the data-source
 * model, based on the {@link RefLookup} annotations at the data-source model.
 * 
 * @author amathe
 * 
 * @param <M>
 * @param <E>
 */
public class ReflookupResolver<M, E> extends AbstractPresenterBase {

	/**
	 * Model (data-source) class
	 */
	private Class<M> modelClass;

	/**
	 * Entity class
	 */
	private Class<E> entityClass;

	/**
	 * Model (data-source) instance.
	 */
	private M ds;

	/**
	 * Entity instance
	 */
	private E e;

	/**
	 * Operation is on insert ?
	 */
	boolean isInsert;

	/**
	 * Entity manager used to execute the queries to lookup the references.
	 */
	private EntityManager em;

	public ReflookupResolver(Class<M> modelClass, Class<E> entityClass, M ds,
			E e, boolean isInsert, EntityManager em) {
		super();
		this.modelClass = modelClass;
		this.entityClass = entityClass;
		this.ds = ds;
		this.e = e;
		this.isInsert = isInsert;
		this.em = em;
	}

	public void execute() throws Exception {
		if (this.modelClass.isAnnotationPresent(RefLookups.class)) {

			RefLookup[] refLookups = this.modelClass.getAnnotation(
					RefLookups.class).value();

			for (RefLookup rl : refLookups) {
				//if (rl.params().length == 1) {
					this.doRefLookup1(ds, e, rl, isInsert);
				//}
			}
		}
	}

	/**
	 * Get the ds-field with the given name.
	 * 
	 * @param fieldName
	 * @return
	 * @throws Exception
	 */
	private Field _getDsField(String fieldName) throws Exception {
		return this.modelClass.getDeclaredField(fieldName);
	}

	/**
	 * Get the getter for the ds-field with the given name.
	 * 
	 * @param fieldName
	 * @return
	 * @throws Exception
	 */
	private Method _getDsGetter(String fieldName) throws Exception {
		return this.modelClass.getMethod("get"
				+ StringUtils.capitalize(fieldName));
	}

	/**
	 * Get the setter for the ds-field with the given name.
	 * 
	 * @param fieldName
	 * @return
	 * @throws Exception
	 */
	private Method _getDsSetter(String fieldName) throws Exception {
		return this.modelClass.getMethod(
				"set" + StringUtils.capitalize(fieldName),
				this._getDsField(fieldName).getType());
	}

	/**
	 * Get the value of the ds-field with the given name.
	 * 
	 * @param fieldName
	 * @return
	 * @throws Exception
	 */
	private Object _getDsFieldValue(String fieldName) throws Exception {
		Method getter = this._getDsGetter(fieldName);
		return getter.invoke(ds, (Object[]) null);
	}

	/**
	 * Get the entity-field with the given name.
	 * 
	 * @param fieldName
	 * @return
	 * @throws Exception
	 */
	private Field _getEntityField(String fieldName) throws Exception {
		return this.entityClass.getDeclaredField(fieldName);
	}

	/**
	 * Get the getter for the entity-field with the given name.
	 * 
	 * @param fieldName
	 * @return
	 * @throws Exception
	 */
	private Method _getEntityGetter(String fieldName) throws Exception {
		return this.entityClass.getMethod("get"
				+ StringUtils.capitalize(fieldName));
	}

	/**
	 * Get the setter for the entity field with the given name.
	 * 
	 * @param fieldName
	 * @return
	 * @throws Exception
	 */
	private Method _getEntitySetter(String fieldName) throws Exception {
		return this.entityClass.getMethod(
				"set" + StringUtils.capitalize(fieldName), this
						._getEntityField(fieldName).getType());
	}

	/**
	 * Get the value of the entity-field with the given name.
	 * 
	 * @param fieldName
	 * @return
	 * @throws Exception
	 */
	private Object _getEntityFieldValue(String fieldName) throws Exception {
		Method getter = this._getEntityGetter(fieldName);
		return getter.invoke(e, (Object[]) null);
	}

	/**
	 * Do the actual work, update the reference field in the entity based on the
	 * ref-lookup rule.
	 * 
	 * @param m
	 * @param e
	 * @param refLookup
	 * @param isInsert
	 * @throws Exception
	 */
	private void doRefLookup1(M m, E e, RefLookup refLookup, boolean isInsert)
			throws Exception {

		String refIdDsFieldName = refLookup.refId();
		Object refIdDsFieldValue = this._getDsFieldValue(refIdDsFieldName);
		String refEntityFieldName = null;
		Field refIdDsField = this._getDsField(refIdDsFieldName);

		if (!refIdDsField.isAnnotationPresent(DsField.class)) {
			throw new Exception(
					"Field "
							+ refIdDsFieldName
							+ " cannot be used as value for refId in @RefLookup annotation as it is not marked as @DsField ");
		} else {
			DsField dsFieldAnnotation = refIdDsField
					.getAnnotation(DsField.class);

			/* Obey to the noInsert and noUpdate rules. */

			if ((isInsert && dsFieldAnnotation.noInsert())
					|| (!isInsert && dsFieldAnnotation.noUpdate())) {
				return;
			}

			String path = dsFieldAnnotation.path();
			if (path.indexOf('.') > 0) {
				// TODO: handle the deep references also ( a.b.c.id )
				refEntityFieldName = path.substring(0, path.indexOf('.'));
			} else {
				throw new Exception(
						"Field "
								+ refIdDsFieldName
								+ " cannot be used as value for refId in @RefLookup annotation as its path(`"
								+ path
								+ "`) in @DsField is not a reference path.");
			}
		}

		Class<?> refClass = this._getEntityField(refEntityFieldName).getType();
		Object ref = this._getEntityFieldValue(refEntityFieldName);
		Method setter = this._getEntitySetter(refEntityFieldName);

		if (refIdDsFieldValue != null) {
			/*
			 * if there is an ID now in DS which points to a different reference
			 * as the one in the original entity then update it to the new one
			 */
			if (ref == null
					|| !((IModelWithId) ref).getId().equals(refIdDsFieldValue)) {
				setter.invoke(e, this.em.find(refClass, refIdDsFieldValue));
			}
		} else {

			/*
			 * If there is no ID given in DS for the reference, try to lookup an
			 * entity based on the given named query which must be a query based
			 * on an unique-key. The given fields as parameters for the
			 * named-query must uniquely identify an entity.
			 */

			boolean shouldTryToFindReference = true;
			Map<String, Object> values = new HashMap<String, Object>();
			Map<String, Object> namedQueryParams = new HashMap<String, Object>();
			for (Param p : refLookup.params()) {
				String paramName = p.name();
				String fieldName = p.field();
				Object fieldValue = this._getDsFieldValue(fieldName);

				if (fieldValue == null
						|| (fieldValue instanceof String && ((String) fieldValue)
								.equals(""))) {
					shouldTryToFindReference = false;
					break;
				} else {
					values.put(fieldName, fieldValue);
					namedQueryParams.put(paramName, fieldValue);
				}
			}

			if (shouldTryToFindReference) {

				String namedQueryName = refLookup.namedQuery();
				Object theReference = null;
				try {
					theReference = (findEntityService(refClass)).findByUk(
							namedQueryName, namedQueryParams);
				} catch (javax.persistence.NoResultException exception) {

					StringBuffer sb = new StringBuffer();

					for (Map.Entry<String, Object> entry : values.entrySet()) {
						sb.append(" `" + entry.getKey() + "` = "
								+ entry.getValue() + "");
					}

					throw new Exception("Cannot find  `"
							+ refClass.getSimpleName() + "` reference using "
							+ sb.toString());
				}
				setter.invoke(e, theReference);
				Method refIdFieldInDsSetter = this
						._getDsSetter(refIdDsFieldName);
				refIdFieldInDsSetter.invoke(m,
						((IModelWithId) theReference).getId());
			} else {
				setter.invoke(e, (Object) null);
			}
		}
	}

}
