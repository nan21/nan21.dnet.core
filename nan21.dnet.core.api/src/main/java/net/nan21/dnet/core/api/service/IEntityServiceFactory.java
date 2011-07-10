package net.nan21.dnet.core.api.service;

public interface IEntityServiceFactory {
	public <E> IEntityService<E> create(String key);
	public <E> IEntityService<E> create(Class<E> type);
}
