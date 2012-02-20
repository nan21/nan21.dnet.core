package net.nan21.dnet.core.presenter.action;

import java.util.List;

/**
 * CSV loader result which returns the parsed data as a list as well as the headers
 * @author amathe
 *
 * @param <T>
 */
public class DsCsvLoaderResult<T> {

	/**
	 * Parsed data as list of T beans
	 */
	private List<T> result;
	
	/**
	 * csv header 
	 */
	private String[] header;

	public List<T> getResult() {
		return result;
	}

	public void setResult(List<T> result) {
		this.result = result;
	}

	public String[] getHeader() {
		return header;
	}

	public void setHeader(String[] header) {
		this.header = header;
	}

}
