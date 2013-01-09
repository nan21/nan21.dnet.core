package net.nan21.dnet.core.api.descriptor;

public class SysParamDefinition {

	public static final String TYPE_STRING = "string";
	public static final String TYPE_BOOLEAN = "boolean";
	public static final String TYPE_NUMBER = "number";

	private String name;
	private String title;
	private String description;
	private String dataType;
	private String defaultValue;
	private String listOfValues;

	public SysParamDefinition(String name, String title, String description,
			String dataType, String defaultValue, String listOfValues) {
		super();
		this.name = name;
		this.title = title;
		this.description = description;
		this.dataType = dataType;
		this.defaultValue = defaultValue;
		this.listOfValues = listOfValues;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	public String getListOfValues() {
		return listOfValues;
	}

	public void setListOfValues(String listOfValues) {
		this.listOfValues = listOfValues;
	}

}
