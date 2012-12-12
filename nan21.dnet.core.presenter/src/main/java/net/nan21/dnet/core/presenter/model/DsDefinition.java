package net.nan21.dnet.core.presenter.model;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

import net.nan21.dnet.core.api.descriptor.IDsDefinition;

@XmlRootElement(name = "dsDefinition")
@XmlAccessorType(XmlAccessType.FIELD)
public class DsDefinition implements IDsDefinition {

	/**
	 * Business name of the data-source component used to identify the component
	 * when serving a request.
	 */
	private String name;

	/**
	 * Data-source model class.
	 */
	private Class<?> modelClass;

	/**
	 * Data-source filter class.
	 */
	private Class<?> filterClass;

	/**
	 * Data-source param class.
	 */
	private Class<?> paramClass;

	/**
	 * Model fields
	 */
	@XmlElementWrapper(name = "modelFields")
	@XmlElement(name = "field")
	private List<FieldDefinition> modelFields;

	/**
	 * Filter fields. If the data-source does not have own filter (it uses the
	 * model as filter ) these are the same as the model fields of course.
	 */
	@XmlElementWrapper(name = "filterFields")
	@XmlElement(name = "field")
	private List<FieldDefinition> filterFields;

	/**
	 * Param fields. If the data-source does not have param model this will be
	 * null;
	 */
	@XmlElementWrapper(name = "paramFields")
	@XmlElement(name = "field")
	private List<FieldDefinition> paramFields;

	/**
	 * Flag which indicates that this is an assignment component.
	 */
	private boolean asgn;

	/**
	 * Flag which indicates that this components provides only read-only
	 * functionality.
	 */
	private boolean readOnly;

	/**
	 * List of publicly exposed service methods.
	 */
	@XmlElementWrapper(name = "serviceMethods")
	@XmlElement(name = "serviceMethod")
	private List<String> serviceMethods;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Class<?> getModelClass() {
		return modelClass;
	}

	public void setModelClass(Class<?> modelClass) {
		this.modelClass = modelClass;
	}

	public Class<?> getFilterClass() {
		return filterClass;
	}

	public void setFilterClass(Class<?> filterClass) {
		this.filterClass = filterClass;
	}

	public Class<?> getParamClass() {
		return paramClass;
	}

	public void setParamClass(Class<?> paramClass) {
		this.paramClass = paramClass;
	}

	public boolean isAsgn() {
		return asgn;
	}

	public void setAsgn(boolean isAsgn) {
		this.asgn = isAsgn;
	}

	public boolean isReadOnly() {
		return readOnly;
	}

	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	}

	public List<String> getServiceMethods() {
		return serviceMethods;
	}

	public void setServiceMethods(List<String> serviceMethods) {
		this.serviceMethods = serviceMethods;
	}

	public void addServiceMethod(String serviceMethod) {
		if (this.serviceMethods == null) {
			this.serviceMethods = new ArrayList<String>();
		}
		this.serviceMethods.add(serviceMethod);
	}

	public List<FieldDefinition> getModelFields() {
		if (this.modelClass != null && this.modelFields == null) {
			this.modelFields = new ArrayList<FieldDefinition>();
			this.resolveFields(this.modelClass, this.modelFields);
		}
		return modelFields;
	}

	public List<FieldDefinition> getFilterFields() {
		if (this.filterClass != null && this.filterFields == null) {
			this.filterFields = new ArrayList<FieldDefinition>();
			this.resolveFields(this.filterClass, this.filterFields);
		}
		return filterFields;
	}

	public List<FieldDefinition> getParamFields() {
		if (this.paramClass != null && this.paramFields == null) {
			this.paramFields = new ArrayList<FieldDefinition>();
			this.resolveFields(this.paramClass, this.paramFields);
		}
		return paramFields;
	}

	private void resolveFields(Class<?> claz, List<FieldDefinition> fieldsList) {
		Class<?> theClass = claz;
		List<String> _tmp = new ArrayList<String>();
		while (theClass != null) {
			Field[] fields = theClass.getDeclaredFields();
			for (Field field : fields) {
				String fieldName = field.getName();
				if (!Modifier.isStatic(field.getModifiers())) {
					if (!fieldName.equals("_entity_")
							&& !fieldName.equals("__clientRecordId__")
							&& !_tmp.contains(fieldName)) {
						_tmp.add(fieldName);
						fieldsList.add(new FieldDefinition(fieldName, field
								.getType().getCanonicalName()));
					}
				}
			}
			theClass = theClass.getSuperclass();
		}
	}
}
