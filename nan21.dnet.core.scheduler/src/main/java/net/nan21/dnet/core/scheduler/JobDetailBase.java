package net.nan21.dnet.core.scheduler;

import net.nan21.dnet.core.api.job.IDsJob;
import net.nan21.dnet.core.api.job.IEntityJob;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;

public class JobDetailBase implements Job {

	private ApplicationContext appContext;
	private ServiceLocatorJob serviceLocatorJob;

	public void execute(JobExecutionContext context)
			throws JobExecutionException {

		try {

			JobDataMap data = context.getJobDetail().getJobDataMap();
			String beanAlias = data.getString("__JOB_NAME__");
			IDsJob dsJob = getServiceLocatorJob().findDsJob(beanAlias);
			if (dsJob != null) {
				dsJob.execute();
			} else {
				IEntityJob entityJob = getServiceLocatorJob().findEntityJob(
						beanAlias);
				if (entityJob != null) {
					entityJob.execute();
				}
			}
		} catch (Exception e) {
			throw new JobExecutionException(e.getMessage());
		}

		System.out.println("***************** JobDetailBase");
	}

	public ApplicationContext getAppContext() {
		return appContext;
	}

	public void setAppContext(ApplicationContext appContext)
			throws BeansException {
		this.appContext = appContext;
	}

	public ServiceLocatorJob getServiceLocatorJob() {
		return serviceLocatorJob;
	}

	public void setServiceLocatorJob(ServiceLocatorJob serviceLocatorJob) {
		this.serviceLocatorJob = serviceLocatorJob;
	}

}
