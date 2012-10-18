package net.nan21.dnet.core.api.ui.extjs;

public class ExtensionFile {

	private String location;
	private boolean relativePath;
	private String fileExtension;

	public ExtensionFile() {
		super();
	}

	public ExtensionFile(String location, boolean relativePath) {
		super();
		this.setLocation(location);
		this.setRelativePath(relativePath);
	}

	/**
	 * Resolve the file's extension from its location.
	 */
	private void resolveExtension() {
		fileExtension = null;
		if (location != null && !location.equals("")) {
			int idx = location.lastIndexOf('.');
			if (!(idx == -1 || idx >= location.length())) {
				this.fileExtension = location.substring(idx);
			}
		}
	}

	/**
	 * Returns true if this is a .js file
	 * 
	 * @return
	 * @throws Exception
	 */
	public boolean isJs() throws Exception {
		if (getFileExtension() != null) {
			return getFileExtension().equalsIgnoreCase(".js");
		} else {
			return false;
		}
	}

	/**
	 * Returns true if this is a .css file
	 * 
	 * @return
	 */
	public boolean isCss() {
		if (getFileExtension() != null) {
			return getFileExtension().equalsIgnoreCase(".css");
		} else {
			return false;
		}
	}

	public String getFileExtension() {
		return fileExtension;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
		this.resolveExtension();
	}

	public boolean isRelativePath() {
		return relativePath;
	}

	public void setRelativePath(boolean relativePath) {
		this.relativePath = relativePath;
	}

}
