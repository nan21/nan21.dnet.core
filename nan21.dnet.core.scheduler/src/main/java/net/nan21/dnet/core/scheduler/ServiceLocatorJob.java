package net.nan21.dnet.core.scheduler;

import java.util.List;

import net.nan21.dnet.core.api.job.IDsJob;
import net.nan21.dnet.core.api.job.IDsJobFactory;
import net.nan21.dnet.core.api.job.IEntityJob;
import net.nan21.dnet.core.api.job.IEntityJobFactory;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class ServiceLocatorJob {

	@Autowired
	protected ApplicationContext appContext;

	private List<IDsJobFactory> dsJobFactories;
	private List<IEntityJobFactory> entityJobFactories;

	public IDsJob findDsJob(String name) throws Exception {
		IDsJob srv = null;
		for (IDsJobFactory f : dsJobFactories) {
			try {
				srv = f.create(name);
				if (srv != null) {
					// srv.setDsServiceFactories(factories);
					// srv.setSystemConfig(this.systemConfig);
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		return null;
		//throw new Exception("Requested job `" + name + "` not found !");
	}

	public IEntityJob findEntityJob(String name) throws Exception {
		IEntityJob srv = null;
		for (IEntityJobFactory f : entityJobFactories) {
			try {
				srv = f.create(name);
				if (srv != null) {
					// srv.setDsServiceFactories(factories);
					// srv.setSystemConfig(this.systemConfig);
					return srv;
				}
			} catch (NoSuchBeanDefinitionException e) {
				// service not found in this factory, ignore
			}
		}
		return null;
		//throw new Exception("Requested job `" + name + "` not found !");
	}

	/**
	 * Getter for the spring application context.
	 * 
	 * @return
	 */
	public ApplicationContext getAppContext() {
		return appContext;
	}

	/**
	 * Setter for the spring application context.
	 * 
	 * @param appContext
	 */
	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

	/**
	 * Get entity job factories. If it is null attempts to retrieve it from
	 * Spring context by <code>osgiEntityJobFactories</code> alias.
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<IEntityJobFactory> getEntityJobFactories() {
		if (this.entityJobFactories == null) {
			this.entityJobFactories = (List<IEntityJobFactory>) this.appContext
					.getBean("osgiEntityJobFactories");
		}
		return this.entityJobFactories;
	}

	/**
	 * Set entity job factories
	 * 
	 * @param entityServiceFactories
	 */
	public void setEntityJobFactories(List<IEntityJobFactory> entityJobFactories) {
		this.entityJobFactories = entityJobFactories;
	}

	/**
	 * Get ds job factories. If it is null attempts to retrieve it from Spring
	 * context by <code>osgiDsJobFactories</code> alias.
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<IDsJobFactory> getDsJobFactories() {
		if (this.dsJobFactories == null) {
			this.dsJobFactories = (List<IDsJobFactory>) this.appContext
					.getBean("osgiDsJobFactories");
		}
		return this.dsJobFactories;
	}

	/**
	 * Set ds job factories
	 * 
	 * @param dsJobFactories
	 */
	public void setDsJobFactories(List<IDsJobFactory> dsJobFactories) {
		this.dsJobFactories = dsJobFactories;
	}

}
