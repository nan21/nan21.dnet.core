package net.nan21.dnet.core.api.descriptor;

import java.util.Map;

public interface IViewModelDescriptor<M> {
	public Class<M> getModelClass();
	public Map<String, String> getRefPaths();

	public boolean isWorksWithJpql();

	public String getJpqlDefaultWhere();

	public String getJpqlDefaultSort() ;
	
}
