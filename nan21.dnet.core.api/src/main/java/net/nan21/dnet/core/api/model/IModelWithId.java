package net.nan21.dnet.core.api.model;

/**
 * Interface to be implemented by all models(entities and view-objects) 
 * which have an <code>id</code> primary key.   
 * @author amathe
 *
 */
public interface IModelWithId {
	public Object getId();		 
}
