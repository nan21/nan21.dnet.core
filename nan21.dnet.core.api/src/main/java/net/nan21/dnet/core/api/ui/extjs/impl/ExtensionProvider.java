package net.nan21.dnet.core.api.ui.extjs.impl;

import net.nan21.dnet.core.api.ui.extjs.IExtensionProvider;

public class ExtensionProvider implements IExtensionProvider {

	private String fileName;
	private String bundleName;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getBundleName() {
		return bundleName;
	}

	public void setBundleName(String bundleName) {
		this.bundleName = bundleName;
	}

}