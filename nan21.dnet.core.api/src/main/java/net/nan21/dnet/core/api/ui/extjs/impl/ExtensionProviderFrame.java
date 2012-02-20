package net.nan21.dnet.core.api.ui.extjs.impl;

import net.nan21.dnet.core.api.ui.extjs.IExtensionProviderFrame;

public class ExtensionProviderFrame implements IExtensionProviderFrame {

	private String fileName;
	private String bundleName;

	private String targetFrame;

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

	public String getTargetFrame() {
		return targetFrame;
	}

	public void setTargetFrame(String targetFrame) {
		this.targetFrame = targetFrame;
	}

}