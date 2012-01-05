package net.nan21.dnet.core.presenter.model;
 
public abstract class AbstractDsModel<E> {
	
	/**
	 * Required when inserting a list of objects to be able to identify the entity as there is no id yet.
	 */
	private E _entity_;
	
	public AbstractDsModel() {	 
	}
	
	public AbstractDsModel(E e) {
		this._entity_ = e;
	}
	
	public E _getEntity_() {
		return this._entity_;
	}
 
	public void _setEntity_(E entity) {
		this._entity_ = entity;
	}
 
	protected Long _asLong_(Object val) {
		if ( val instanceof Long ) {
			return (Long) val;
		} 
		if ( val instanceof Integer ){
			return Long.valueOf((Integer)val);
		} 
		if ( val instanceof String ){
			return Long.valueOf((String)val);
		}
		return (Long) val;
	}	 
}
