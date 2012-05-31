package net.nan21.dnet.core.scheduler;

import org.quartz.Job;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.simpl.SimpleJobFactory;
import org.quartz.spi.TriggerFiredBundle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class MyJobFactory extends SimpleJobFactory {

	@Autowired
	protected ApplicationContext appContext;

	protected ServiceLocatorJob serviceLocatorJob;

	@Override
	public Job newJob(TriggerFiredBundle bundle, Scheduler scheduler)
			throws SchedulerException {

		Job job = super.newJob(bundle, scheduler);
		if (job instanceof JobDetailBase) {
			JobDetailBase b = (JobDetailBase) job;

			b.setAppContext(appContext);
			b.setServiceLocatorJob(serviceLocatorJob);
		}
		return job;
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

	public ServiceLocatorJob getServiceLocatorJob() {
		return serviceLocatorJob;
	}

	public void setServiceLocatorJob(ServiceLocatorJob serviceLocatorJob) {
		this.serviceLocatorJob = serviceLocatorJob;
	}

}
