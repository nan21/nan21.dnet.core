package net.nan21.dnet.core.api.action;

public interface IActionResultRpcFilter extends IActionResult {

	public Object getData();

	public void setData(Object data);

	public Object getParams();

	public void setParams(Object params);

}
