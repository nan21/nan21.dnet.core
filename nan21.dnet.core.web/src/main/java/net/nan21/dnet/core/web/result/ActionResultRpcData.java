package net.nan21.dnet.core.web.result;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import net.nan21.dnet.core.api.action.IActionResultRpcData;

@XmlRootElement(name = "result")
@XmlAccessorType(XmlAccessType.FIELD)
public class ActionResultRpcData extends AbstractResultData implements
		IActionResultRpcData {

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
