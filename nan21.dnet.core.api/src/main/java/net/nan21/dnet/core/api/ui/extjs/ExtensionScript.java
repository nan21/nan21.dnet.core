package net.nan21.dnet.core.api.ui.extjs;

public class ExtensionScript {

	private String location;
	private boolean relativePath;

	public ExtensionScript() {
		super();
	}

	public ExtensionScript(String location, boolean relativePath) {
		super();
		this.location = location;
		this.relativePath = relativePath;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public boolean isRelativePath() {
		return relativePath;
	}

	public void setRelativePath(boolean relativePath) {
		this.relativePath = relativePath;
	}

}
