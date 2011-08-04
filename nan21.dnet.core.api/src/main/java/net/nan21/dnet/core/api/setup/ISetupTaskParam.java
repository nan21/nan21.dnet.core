package net.nan21.dnet.core.api.setup;

public interface ISetupTaskParam {
	
	public static final String PREFIX = "stp_";
	public String getName();

	public void setName(String name);

	public String getTitle();

	public void setTitle(String title);

	public String getDescription();

	public void setDescription(String description);

	public String getFieldType();

	public void setFieldType(String fieldType);

	public String getDataType();

	public void setDataType(String dataType);

	public String getDefaultValue();

	public void setDefaultValue(String defaultValue);

	public String getListOfValues();

	public void setListOfValues(String listOfValues);

	public String getValue();

	public void setValue(String value);

	public boolean isRequired();

	public void setRequired(boolean required);
}
