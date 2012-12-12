/*
 * DNet eBusiness Suite
 * Project: dnet-web-core 
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.web.result;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

import net.nan21.dnet.core.api.action.IActionResultFind;

@XmlRootElement(name = "result")
@XmlAccessorType(XmlAccessType.FIELD)
public class ActionResultFind extends AbstractResultData implements
		IActionResultFind {

	/**
	 * Total number of results which match the filter.
	 */
	private Long totalCount;

	/**
	 * Actual result data list.
	 */
	@XmlElementWrapper(name = "dataList")
	@XmlElement(name = "data")
	private List<?> data;

	/**
	 * Parameters.
	 */
	private Object params;

	/**
	 * @return the totalCount
	 */
	public Long getTotalCount() {
		return this.totalCount;
	}

	/**
	 * @param totalCount
	 *            the totalCount to set
	 */
	public void setTotalCount(Long totalCount) {
		this.totalCount = totalCount;
	}

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
