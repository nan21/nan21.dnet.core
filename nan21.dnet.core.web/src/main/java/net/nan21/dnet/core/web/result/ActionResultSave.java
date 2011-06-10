package net.nan21.dnet.core.web.result;

import java.util.List;

import net.nan21.dnet.core.api.action.IActionResultSave;

public class ActionResultSave extends AbstractResultData 
	implements IActionResultSave{
 
    
    /**
     * Actual result data list.
     */
    private List<?> data;

    /**
     * Parameters.
     */
    private Object params;
 
    /**
     * @return the data
     */
    public List<?> getData() {
        return this.data;
    }

    /**
     * @param data
     *            the data to set
     */
    public void setData(List<?> data) {
        this.data = data;
    }

	public Object getParams() {
		return params;
	}

	public void setParams(Object params) {
		this.params = params;
	}
}
