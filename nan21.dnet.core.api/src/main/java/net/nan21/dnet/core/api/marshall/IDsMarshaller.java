package net.nan21.dnet.core.api.marshall;

import java.io.OutputStream;
import java.util.List;

import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.action.IActionResultSave;

public interface IDsMarshaller<M, P> {

	public static final String XML = "xml";
	public static final String JSON = "json";
	public static final String CSV = "csv";
	
	public M readDataFromString(String source) throws Exception;
	public List<M> readListFromString(String source) throws Exception;
	public <T> List<T> readListFromString(String source, Class<T> type) throws Exception ;
	public P readParamsFromString(String source) throws Exception;
		
	public String writeDataToString(M m) throws Exception;
	public String writeListToString(List<M> list) throws Exception;
	public String writeParamsToString(P p) throws Exception;
	public String writeResultToString(IActionResultFind result) throws Exception;
	public String writeResultToString(IActionResultSave result) throws Exception;

	public void writeDataToStream(M m, OutputStream out) throws Exception;
	public void writeListToStream(List<M> list, OutputStream out) throws Exception;
	public void writeParamsToStream(P p, OutputStream out) throws Exception;
	public void writeResultToStream(IActionResultFind result, OutputStream out) throws Exception;
	public void writeResultToStream(IActionResultSave result, OutputStream out) throws Exception;

}
