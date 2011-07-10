package net.nan21.dnet.core.api.service;

import java.util.List;

import javax.persistence.EntityManager;

public interface IAsgnTxService<E> {

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
	
	 
	public String getSelectionId();
	public void setSelectionId(String selectionId);

	public Long getObjectId();
	public void setObjectId(Long objectId) ;
	 
	public String getLeftTable();
	public void setLeftTable(String leftTable);
	public String getRightTable();
	public void setRightTable(String rightTable) ;

	public String getRightObjectIdField();
	public void setRightObjectIdField(String rightObjectIdField);
	public String getRightItemIdField();
	public void setRightItemIdField(String rightItemIdField);
	
	
	public EntityManager getEntityManager();
	public void setEntityManager(EntityManager em);
	
}
