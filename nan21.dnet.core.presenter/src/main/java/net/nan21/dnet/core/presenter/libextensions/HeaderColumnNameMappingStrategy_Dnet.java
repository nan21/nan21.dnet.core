package net.nan21.dnet.core.presenter.libextensions;

import au.com.bytecode.opencsv.bean.HeaderColumnNameMappingStrategy;

public class HeaderColumnNameMappingStrategy_Dnet<T> extends HeaderColumnNameMappingStrategy<T>{

	public String[] getHeader() {
		return this.header;
	}
}
