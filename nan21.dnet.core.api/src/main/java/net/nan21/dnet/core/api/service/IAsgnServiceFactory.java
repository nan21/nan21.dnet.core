package net.nan21.dnet.core.api.service;
 
public interface IAsgnServiceFactory {

	public <M,P> IAsgnService<M,P>  create(String key);
}
