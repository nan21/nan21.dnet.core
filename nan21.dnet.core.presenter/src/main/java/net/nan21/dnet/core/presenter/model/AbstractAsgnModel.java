package net.nan21.dnet.core.presenter.model;
 
public abstract class AbstractAsgnModel<E>  {
 
	protected Long clientId;
	
	private E _entity_;
	
	public AbstractAsgnModel() {	 
	}
	
	public AbstractAsgnModel(E e) {
		this._entity_ = e;
	}
	
	public E _getEntity_() {
		return this._entity_;
	}
 
	public void _setEntity_(E entity) {
		this._entity_ = entity;
	}
	
	/**
     * @return the clientId
     */
    public Long getClientId() {
        return this.clientId;
    }

    /**
     * @param clientId the clientId to set
     */
    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }
 
}
