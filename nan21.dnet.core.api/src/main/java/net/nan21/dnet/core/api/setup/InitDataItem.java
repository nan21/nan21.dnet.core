package net.nan21.dnet.core.api.setup;

import java.io.File;

public class InitDataItem {

	private String sequence;
	private String dsName;
	private String fileName;
	private File file;
	private String destPath; 
	private String ukFieldName; 
	
	public String getDestPath() {
		return destPath;
	}
	public void setDestPath(String destPath) {
		this.destPath = destPath;
	}
	public String getSequence() {
		return sequence;
	}
	public void setSequence(String sequence) {
		this.sequence = sequence;
	}
	public String getDsName() {
		return dsName;
	}
	public void setDsName(String dsName) {
		this.dsName = dsName;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public File getFile() {
		return file;
	}
	public void setFile(File file) {
		this.file = file;
	}
	public String getUkFieldName() {
		return ukFieldName;
	}
	public void setUkFieldName(String ukFieldName) {
		this.ukFieldName = ukFieldName;
	}
	 
	
}
