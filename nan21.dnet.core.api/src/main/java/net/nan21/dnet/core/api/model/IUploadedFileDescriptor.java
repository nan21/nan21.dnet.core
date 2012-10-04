package net.nan21.dnet.core.api.model;

public interface IUploadedFileDescriptor {
	public String getOriginalName();

	public void setOriginalName(String originalName);

	public String getNewName();

	public void setNewName(String newName);

	public String getContentType();

	public void setContentType(String contentType);

	public long getSize();

	public void setSize(long size);
}
