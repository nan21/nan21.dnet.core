package net.nan21.dnet.core.api.service;

public interface IDsServiceFactory {
	
	public String getName();
	public <M,F,P> IDsService<M,F,P> create(String key);
}
