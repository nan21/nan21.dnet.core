package net.nan21.dnet.core.business.job;

import net.nan21.dnet.core.api.job.IEntityJob;
import net.nan21.dnet.core.api.job.IEntityJobFactory;
import net.nan21.dnet.core.business.AbstractApplicationContextAware;

public class EntityJobFactory extends AbstractApplicationContextAware implements
		IEntityJobFactory {

	@Override
	public IEntityJob create(String key) {
		IEntityJob s = (IEntityJob) this.getApplicationContext().getBean(key);
		return s;
	}

}
