package net.nan21.dnet.core.web.result;

import net.nan21.dnet.core.api.action.IActionResultRpcFilter;

public class ActionResultRpcFilter implements IActionResultRpcFilter {
	  
    /**
     * Data value-object.
     */
    private Object data;

    /**
     * Parameters.
     */
    private Object params;

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public Object getParams() {
		return params;
	}

	public void setParams(Object params) {
		this.params = params;
	}
 
    
}
