package net.nan21.dnet.core.business.service.asgn;

import java.util.List;
import java.util.UUID;

import net.nan21.dnet.core.business.service.AbstractBusinessBaseService;

public abstract class AbstractAsgnTxService<E> extends
		AbstractBusinessBaseService {

	private Class<E> entityClass;

	protected final String ASGN_TEMP_TABLE = "AD_TEMP_ASGN";
	protected final String ASGNLINE_TEMP_TABLE = "AD_TEMP_ASGN_LINE";

	protected String leftTable;
	protected String leftPkField;

	protected String rightTable;
	protected String rightObjectIdField;
	protected String rightItemIdField;

	protected boolean saveAsSqlInsert = true;

	// TODO: get rid of these here
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

		this.getEntityManager()
				.createNativeQuery(
						"insert into " + this.ASGNLINE_TEMP_TABLE
								+ " (selection_uuid, itemId)" + " select ?, "
								+ this.leftPkField + " from " + this.leftTable
								+ " r where r." + this.leftPkField + "  in "
								+ sb.toString())
				.setParameter(1, this.selectionId).executeUpdate();
		this.getEntityManager().flush();
	}

	/**
	 * Add all the available values to the selected ones.
	 * 
	 * @throws Exception
	 */
	public void moveRightAll() throws Exception {
		moveLeftAll();
		this.getEntityManager()
				.createNativeQuery(
						"insert into " + this.ASGNLINE_TEMP_TABLE
								+ " ( selection_uuid, itemId)"
								+ " select  ?,  " + this.leftPkField
								+ "  from " + this.leftTable + " ")
				.setParameter(1, this.selectionId).executeUpdate();
		this.getEntityManager().flush();
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
		this.getEntityManager()
				.createNativeQuery(
						"delete from " + this.ASGNLINE_TEMP_TABLE
								+ " WHERE  selection_uuid = ? and itemId in "
								+ sb.toString() + "")
				.setParameter(1, this.selectionId).executeUpdate();
		this.getEntityManager().flush();

	}

	/**
	 * Remove all the selected values.
	 * 
	 * @throws Exception
	 */
	public void moveLeftAll() throws Exception {
		this.getEntityManager()
				.createNativeQuery(
						"delete from " + this.ASGNLINE_TEMP_TABLE
								+ " WHERE selection_uuid = ?")
				.setParameter(1, this.selectionId).executeUpdate();
		this.getEntityManager().flush();
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
		this.getEntityManager()
				.createNativeQuery(
						"insert into " + this.ASGN_TEMP_TABLE
								+ " (uuid, asgncmp) values( ? ,?  ) ")
				.setParameter(1, this.selectionId).setParameter(2, asgnName)
				.executeUpdate();
		this.getEntityManager().flush();
		this.reset();
		return this.selectionId;
	}

	/**
	 * Clean-up the temporary tables.
	 * 
	 * @throws Exception
	 */
	public void cleanup() throws Exception {
		this.getEntityManager()
				.createNativeQuery(
						"delete from " + this.ASGNLINE_TEMP_TABLE
								+ "  WHERE   selection_uuid = ? ")
				.setParameter(1, this.selectionId).executeUpdate();
		this.getEntityManager()
				.createNativeQuery(
						"delete from " + this.ASGN_TEMP_TABLE
								+ "   WHERE uuid = ? ")
				.setParameter(1, this.selectionId).executeUpdate();
		this.getEntityManager().flush();
	}

	/**
	 * Restores all the changes made by the user in the TEMP_ASGN_LINE table to
	 * the initial state.
	 * 
	 * @throws Exception
	 */
	public void reset() throws Exception {
		this.getEntityManager()
				.createNativeQuery(
						"delete from " + this.ASGNLINE_TEMP_TABLE
								+ " where selection_uuid = ? ")
				.setParameter(1, this.selectionId).executeUpdate();
		this.getEntityManager().flush();

		this.getEntityManager()
				.createNativeQuery(
						"insert into " + this.ASGNLINE_TEMP_TABLE
								+ " (selection_uuid, itemId)" + " select ?, "
								+ this.rightItemIdField + " from "
								+ this.rightTable + " where "
								+ this.rightObjectIdField + " = ? ")
				.setParameter(1, this.selectionId)
				.setParameter(2, this.objectId).executeUpdate();
		this.getEntityManager().flush();
	}

	public void save() throws Exception {
		this.getEntityManager()
				.createNativeQuery(
						"delete from " + this.rightTable + " where  "
								+ this.rightObjectIdField + " = ? ")
				.setParameter(1, this.objectId).executeUpdate();
		this.getEntityManager().flush();
		if (this.saveAsSqlInsert) {
			this.getEntityManager()
					.createNativeQuery(
							"insert into " + this.rightTable + " ( "
									+ this.rightObjectIdField + ",  "
									+ this.rightItemIdField + " ) "
									+ " select ?, itemId from  "
									+ this.ASGNLINE_TEMP_TABLE + " "
									+ "  where selection_uuid = ? ")
					.setParameter(1, this.objectId)
					.setParameter(2, this.selectionId).executeUpdate();
		} else {
			@SuppressWarnings("unchecked")
			List<Long> list = this
					.getEntityManager()
					.createNativeQuery(
							" select itemId from  " + this.ASGNLINE_TEMP_TABLE
									+ " " + "  where selection_uuid = ? ")
					.setParameter(1, this.selectionId).getResultList();
			this.onSave(list);
			// TODO: find a solution other than create entities
			// Might be expensive if there are lots of selected items
			// Anyway this situations requires custom code
		}
	}

	protected void onSave(List<Long> ids) throws Exception {
	}

	// ==================== getters- setters =====================

	public Class<E> getEntityClass() {
		return entityClass;
	}

	public void setEntityClass(Class<E> entityClass) {
		this.entityClass = entityClass;
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

	public String getLeftPkField() {
		return leftPkField;
	}

	public void setLeftPkField(String leftPkField) {
		this.leftPkField = leftPkField;
	}
}
