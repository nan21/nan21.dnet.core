package net.nan21.dnet.core.api.setup;
 
import java.util.List;
import java.util.Map;

public interface ISetupTask {

	public String getId();	 
	public String getTitle();
	public String getDescription();
	public List<ISetupTaskParam> getParams();
	
	public void setParamValues(Map<String, Object> values);
} 
