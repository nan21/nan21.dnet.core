package net.nan21.dnet.core.api.setup;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SetupTask implements ISetupTask {

	private String id;	 
	private String title;
	private String description;
	List<ISetupTaskParam> params;
	
	public void addToParams(ISetupTaskParam e) {
		if(this.params == null) {
			this.params = new ArrayList<ISetupTaskParam>();
		}
		this.params.add(e);
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	public List<ISetupTaskParam> getParams() {
		return params;
	}
	public void setParams(List<ISetupTaskParam> params) {
		this.params = params;
	}

	@Override
	public void setParamValues(Map<String, Object> values) {
		for(ISetupTaskParam param: params) {
			String[] v = (String[])values.get(ISetupTaskParam.PREFIX + param.getName());
			if (v!=null) {
				param.setValue(  ((String[]) values.get(ISetupTaskParam.PREFIX + param.getName()))[0]  );				
			} else {
				param.setValue(null);
			}			
		}		
	}
	
	public Map<String, ISetupTaskParam> getParamsAsMap() {
		Map<String, ISetupTaskParam> map = new HashMap<String, ISetupTaskParam>();
		for(ISetupTaskParam param: params) {
			map.put(param.getName(), param);
		}
		return map;
	}
 
}
