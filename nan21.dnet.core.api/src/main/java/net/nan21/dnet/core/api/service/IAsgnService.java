package net.nan21.dnet.core.api.service;

import java.util.List;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.api.action.IQueryBuilder;
import net.nan21.dnet.core.api.marshall.IDsMarshaller;

public interface IAsgnService<M,F,P> {

	/**
	 * Saves the selection(s).
	 * 
	 * @throws Exception
	 */
	public void save() throws Exception;
	/**
	 * Restores all the changes made by the user to
	 * the initial state.
	 * 
	 * @throws Exception
	 */
	public void reset() throws Exception;
	/**
	 * Add the specified list of IDs to the selected ones.
	 * 
	 * @param ids
	 * @throws Exception
	 */
	public void moveRight(List<Long> ids) throws Exception ;
	
	/**
	 * Add all the available values to the selected ones.
	 * 
	 * @throws Exception
	 */
	public void moveRightAll() throws Exception ;
	
	/**
	 * Remove the specified list of IDs from the selected ones.
	 * 
	 * @param ids
	 * @throws Exception
	 */
	public void moveLeft(List<Long> ids) throws Exception;
	
	/**
	 * Remove all the selected values.
	 * 
	 * @throws Exception
	 */
	public void moveLeftAll() throws Exception;
	
	
	/**
	 * Initialize the temporary table with the existing selection. Creates a
	 * record in the TEMP_ASGN table and the existing selections in
	 * TEMP_ASGN_LINE.
	 * 
	 * @return the UUID of the selection
	 * @throws Exception
	 */
	public String setup(String asgnName) throws Exception;
	
	/**
	 * Clean-up the temporary tables.
	 * 
	 * @throws Exception
	 */
	public void cleanup() throws Exception;
	
	 
	
	public List<M> findLeft( F filter, P params, IQueryBuilder<M,F,P> builder) throws Exception;	
	public List<M> findRight( F filter, P params, IQueryBuilder<M,F,P> builder) throws Exception;
 
	public Long countLeft(F filter, P params, IQueryBuilder<M,F,P> builder) throws Exception;
	public Long countRight(F filter, P params, IQueryBuilder<M,F,P> builder) throws Exception;
	
	public IQueryBuilder<M,F,P> createQueryBuilder() throws Exception;
	public IDsMarshaller<M,F,P> createMarshaller(String dataFormat) throws Exception;
	 
	public List<IAsgnTxServiceFactory> getAsgnTxServiceFactories();
	public void setAsgnTxServiceFactories(
			List<IAsgnTxServiceFactory> asgnTxServiceFactories);
	
	
	public String getSelectionId();
	public void setSelectionId(String selectionId);

	public Long getObjectId();
	public void setObjectId(Long objectId) ;
	
	/**
	 * Getter for system configuration.
	 * 
	 * @return
	 */
	public ISystemConfig getSystemConfig();

	/**
	 * Setter for system configuration.
	 * 
	 * @param systemConfig
	 */
	public void setSystemConfig(ISystemConfig systemConfig);
}
