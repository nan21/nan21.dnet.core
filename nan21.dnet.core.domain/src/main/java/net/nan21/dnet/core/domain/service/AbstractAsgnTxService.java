package net.nan21.dnet.core.domain.service;

import java.util.List;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;

public class AbstractAsgnTxService<E>  {
	@PersistenceContext
	@Autowired
	protected EntityManager em;	 
	 
	protected final String ASGN_TEMP_TABLE = "TEMP_ASGN";
	protected final String ASGNLINE_TEMP_TABLE = "TEMP_ASGN_LINE";
 
	protected String leftTable;
	protected String leftPkField;
	
	protected String rightTable;
	protected String rightObjectIdField;
	protected String rightItemIdField;
	
	protected String selectionId;
	protected Long objectId;
	
	/**
	 * Add the specified list of IDs to the selected ones.
	 * 
	 * @param ids
	 * @throws Exception
	 */ 
	 
	public void moveRight(List<Long> ids) throws Exception {
		StringBuffer sb = new StringBuffer("(-1");
		for (Long id : ids) {
			sb.append("," + id);
		}
		sb.append(")");

		this.em.createNativeQuery(
				"insert into " + this.ASGNLINE_TEMP_TABLE
						+ " (selection_uuid, itemId)" + " select ?, "
						+ this.leftPkField + " from " + this.leftTable
						+ " r where r." + this.leftPkField + "  in "
						+ sb.toString()).setParameter(1, this.selectionId)
				.executeUpdate();
		this.em.flush();
	}
	
	
	
	/**
	 * Add all the available values to the selected ones.
	 * 
	 * @throws Exception
	 */
	public void moveRightAll() throws Exception {
		moveLeftAll();
		this.em.createNativeQuery(
				"insert into " + this.ASGNLINE_TEMP_TABLE
						+ " ( selection_uuid, itemId)" + " select  ?,  "
						+ this.leftPkField + "  from " + this.leftTable + " ")
				.setParameter(1, this.selectionId).executeUpdate();
		this.em.flush();
	}
	
	/**
	 * Remove the specified list of IDs from the selected ones.
	 * 
	 * @param ids
	 * @throws Exception
	 */
	public void moveLeft(List<Long> ids) throws Exception {
		StringBuffer sb = new StringBuffer("(-1");
		for (Long id : ids) {
			sb.append("," + id);
		}
		sb.append(")");
		this.em.createNativeQuery(
				"delete from " + this.ASGNLINE_TEMP_TABLE
						+ " WHERE  selection_uuid = ? and itemId in "
						+ sb.toString() + "").setParameter(1, this.selectionId)
				.executeUpdate();
		this.em.flush();

	}
	
	/**
	 * Remove all the selected values.
	 * 
	 * @throws Exception
	 */
	public void moveLeftAll() throws Exception {
		this.em.createNativeQuery(
				"delete from " + this.ASGNLINE_TEMP_TABLE
						+ " WHERE selection_uuid = ?").setParameter(1,
				this.selectionId).executeUpdate();
		this.em.flush();
	}

	
	
	/**
	 * Initialize the temporary table with the existing selection. Creates a
	 * record in the TEMP_ASGN table and the existing selections in
	 * TEMP_ASGN_LINE.
	 * 
	 * @return the UUID of the selection
	 * @throws Exception
	 */
	public String setup(String asgnName) throws Exception {		 
		this.selectionId = UUID.randomUUID().toString();
		this.em.createNativeQuery(
				"insert into " + this.ASGN_TEMP_TABLE
						+ " (uuid, asgncmp) values( ? ,?  ) ").setParameter(1,
				this.selectionId).setParameter(2, asgnName)
				.executeUpdate();
		this.em.flush();
		this.reset();
		return this.selectionId;
	}
	
	
	/**
	 * Clean-up the temporary tables.
	 * 
	 * @throws Exception
	 */
	public void cleanup() throws Exception {
		this.em.createNativeQuery(
				"delete from " + this.ASGNLINE_TEMP_TABLE
						+ "  WHERE   selection_uuid = ? ").setParameter(1,
				this.selectionId).executeUpdate();
		this.em.createNativeQuery(
				"delete from " + this.ASGN_TEMP_TABLE + "   WHERE uuid = ? ")
				.setParameter(1, this.selectionId).executeUpdate();
		this.em.flush();
	}
	
	/**
	 * Restores all the changes made by the user in the TEMP_ASGN_LINE table to
	 * the initial state.
	 * 
	 * @throws Exception
	 */
	public void reset() throws Exception {
		this.em.createNativeQuery(
				"delete from " + this.ASGNLINE_TEMP_TABLE
						+ " where selection_uuid = ? ").setParameter(1,
				this.selectionId).executeUpdate();
		this.em.flush();

		this.em.createNativeQuery(
				"insert into " + this.ASGNLINE_TEMP_TABLE
						+ " (selection_uuid, itemId)" + " select ?, "
						+ this.rightItemIdField + " from " + this.rightTable
						+ " where " + this.rightObjectIdField + " = ? ")
				.setParameter(1, this.selectionId).setParameter(2,
						this.objectId).executeUpdate();
		this.em.flush();
	}
 
	 
	public void save() throws Exception {
		// TODO Auto-generated method stub
		
	}
	
	// ====================  getters- setters =====================
	
	
	
	/*
	 * @return the entity manager  
	 */
	public EntityManager getEntityManager() {
		return this.em;
	}

	public String getRightTable() {
		return rightTable;
	}

	public void setRightTable(String rightTable) {
		this.rightTable = rightTable;
	}

	public String getSelectionId() {
		return selectionId;
	}

	public void setSelectionId(String selectionId) {
		this.selectionId = selectionId;
	}

	 
	public Long getObjectId() {
		return objectId;
	}
 
	public void setObjectId(Long objectId) {
		this.objectId = objectId;
	}

 
	/*
	 * @param em the entity manager to set
	 */
	public void setEntityManager(EntityManager em) {
		this.em = em;		 
	}



	public String getLeftTable() {
		return leftTable;
	}
 
	public void setLeftTable(String leftTable) {
		this.leftTable = leftTable;
	}
 
	public String getRightObjectIdField() {
		return rightObjectIdField;
	}
 
	public void setRightObjectIdField(String rightObjectIdField) {
		this.rightObjectIdField = rightObjectIdField;
	}
 
	public String getRightItemIdField() {
		return rightItemIdField;
	}
 
	public void setRightItemIdField(String rightItemIdField) {
		this.rightItemIdField = rightItemIdField;
	}  
	
	
	
	
}
