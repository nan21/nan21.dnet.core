package net.nan21.dnet.core.api.service;

public interface IAsgnTxServiceFactory {
	public <E> IAsgnTxService<E> create(String key);
	public <E> IAsgnTxService<E> create(Class<E> type);
	
	public String getName();
	public void setName(String name);
}
