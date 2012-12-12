package net.nan21.dnet.core.web.result;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

import net.nan21.dnet.core.api.action.IActionResultSave;

@XmlRootElement(name = "result")
@XmlAccessorType(XmlAccessType.FIELD)
public class ActionResultSave extends AbstractResultData implements
		IActionResultSave {

	/**
	 * Actual result data list.
	 */
	@XmlElementWrapper(name = "data-list")
	@XmlElement(name = "data")
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
