package net.nan21.dnet.core.api.job;

public interface IDsJobFactory {
	public String getName();

	public IDsJob create(String key);
}
