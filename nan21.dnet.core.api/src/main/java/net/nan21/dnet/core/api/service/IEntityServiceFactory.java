package net.nan21.dnet.core.api.service;

public interface IEntityServiceFactory {
	public IEntityService create(String key);
	public IEntityService create(Class<?> type);
}
