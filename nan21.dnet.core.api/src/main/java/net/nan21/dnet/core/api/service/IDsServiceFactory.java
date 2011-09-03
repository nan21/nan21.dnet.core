package net.nan21.dnet.core.api.service;

public interface IDsServiceFactory {
	
	public String getName();
	public <M,P> IDsService<M,P> create(String key);
}
