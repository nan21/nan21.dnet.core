package net.nan21.dnet.core.presenter.model;

import net.nan21.dnet.core.api.model.IUploadedFileDescriptor;

public class UploadedFileDescriptor implements IUploadedFileDescriptor {

	String originalName;
	String newName;
	String contentType;
	long size;

	public String getOriginalName() {
		return originalName;
	}

	public void setOriginalName(String originalName) {
		this.originalName = originalName;
	}

	public String getNewName() {
		return newName;
	}

	public void setNewName(String newName) {
		this.newName = newName;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public long getSize() {
		return size;
	}

	public void setSize(long size) {
		this.size = size;
	}

}
