package net.nan21.dnet.core.api;

import net.nan21.dnet.core.api.IProductInfo;

public class ProductInfo implements IProductInfo {

	private String name;
	private String version;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

}
