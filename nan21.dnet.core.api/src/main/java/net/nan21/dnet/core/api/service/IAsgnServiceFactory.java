package net.nan21.dnet.core.api.service;
 
public interface IAsgnServiceFactory {

	public <M,F,P> IAsgnService<M,F,P>  create(String key);
}
