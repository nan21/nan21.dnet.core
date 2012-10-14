package net.nan21.dnet.core.api.action;

/**
 * Root interface of the result types
 * 
 * @author amathe
 * 
 */
public interface IActionResult {
	/**
	 * Get the total execution time in milliseconds.
	 * 
	 * @return
	 */
	public long getExecutionTime();

	/**
	 * Set the total execution time in milliseconds.
	 * 
	 * @param executionTime
	 */
	public void setExecutionTime(long executionTime);
}
