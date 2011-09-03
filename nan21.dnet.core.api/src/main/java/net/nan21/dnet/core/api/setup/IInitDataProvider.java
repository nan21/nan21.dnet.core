package net.nan21.dnet.core.api.setup;

import java.util.List;

public interface IInitDataProvider {
	
	public List<InitData> getList();
	public void setList(List<InitData> list); 
	public void addToList(InitData initData);
}
