package net.nan21.dnet.core.presenter.model;

import java.text.SimpleDateFormat;
import java.util.Date;

import net.nan21.dnet.core.api.model.IFilterRule;

/**
 * Describes one filter rule.
 * 
 * @author amathe
 * 
 */
public class FilterRule implements IFilterRule {

	String fieldName;
	String operation;
	String value1;
	String value2;

	Class<?> dataType;
	String dataTypeFQN;

	public FilterRule() {
		super();
	}

	public FilterRule(String fieldName, String operation, String value1,
			String value2) {
		super();
		this.fieldName = fieldName;
		this.operation = operation;
		this.value1 = value1;
		this.value2 = value2;

	}

	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

	public String getValue1() {
		return value1;
	}

	public void setValue1(String value1) {
		this.value1 = value1;
	}

	public String getValue2() {
		return value2;
	}

	public void setValue2(String value2) {
		this.value2 = value2;
	}

	public String getDataTypeFQN() {
		return dataTypeFQN;
	}

	public void setDataTypeFQN(String dataTypeFQN)
			throws ClassNotFoundException {
		this.dataTypeFQN = dataTypeFQN;
		if (dataType == null) {
			dataType = Class.forName(dataTypeFQN);
		}
	}

	public Object getConvertedValue1() throws Exception {
		return this._convertValue(this.value1);
	}

	public Object getConvertedValue2() throws Exception {
		return this._convertValue(this.value2);
	}

	private Object _convertValue(String v) throws Exception {
		if (v == null) {
			return null;
		}
		if (dataType == Integer.class) {
			return Integer.parseInt(v);
		}
		if (dataType == Float.class) {
			return Float.parseFloat(v);
		}
		if (dataType == Long.class) {
			return Long.parseLong(v);
		}
		if (dataType == Boolean.class) {
			return Boolean.parseBoolean(v);
		}
		if (dataType == Date.class) {
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
			return df.parse(v);
		}

		return v;
	}
}
