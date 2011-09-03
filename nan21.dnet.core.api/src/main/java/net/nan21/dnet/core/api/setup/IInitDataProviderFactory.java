package net.nan21.dnet.core.api.setup;

public interface IInitDataProviderFactory {

	public IInitDataProvider createProvider();

	public String getName();

	public void setName(String name);
}
