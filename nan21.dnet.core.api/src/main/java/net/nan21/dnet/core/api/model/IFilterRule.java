package net.nan21.dnet.core.api.model;

public interface IFilterRule {
	public String getFieldName();

	public void setFieldName(String fieldName);

	public String getOperation();

	public void setOperation(String operation);

	public String getValue1();

	public void setValue1(String value1);

	public String getValue2();

	public void setValue2(String value2);

}
