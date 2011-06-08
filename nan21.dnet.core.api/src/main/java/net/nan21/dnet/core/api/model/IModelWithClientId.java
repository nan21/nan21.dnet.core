package net.nan21.dnet.core.api.model;

/**
 * Interface to implement by all domain entities except the Client domain entity.
 * A client is an isolated self-contained environment.
 * @author AMATHE
 *
 */
public interface IModelWithClientId {
	public Long getClientId();
	public void setClientId(Long clientId);
} 
