package net.nan21.dnet.core.api.action;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IDsExport<M> {
	public void begin() throws Exception;
	public void end() throws Exception;	
	public void write(M data, boolean isFirst) throws Exception;
	public File getOutFile()  throws IOException; 
	public void setOutFile(File outFile);
	 
	public String getOutFilePath();
	public void setOutFilePath(String outFilePath); 
	
	public String getOutFileName();
	public void setOutFileName(String outFileName);

	public String getOutFileExtension();
	
	public List<String> getFieldNames();
	public void setFieldNames(List<String> fieldNames);
	public List<String> getFieldTitles();
	public void setFieldTitles(List<String> fieldTitles);
	public List<String> getFieldWidths();
	public void setFieldWidths(List<String> fieldWidths) ;
	public Map<String, Object> getProperties();
	public void setProperties(Map<String, Object> properties);
	
}
