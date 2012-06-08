package net.nan21.dnet.core.scheduler;

import java.util.Properties;

import javax.sql.DataSource;

import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.impl.StdSchedulerFactory;
import org.quartz.spi.JobFactory;
import org.quartz.utils.DBConnectionManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import net.nan21.dnet.core.api.job.IScheduler;

public class JobScheduler implements IScheduler {

	@Autowired
	protected ApplicationContext appContext;

	protected ServiceLocatorJob serviceLocatorJob;

	protected JobFactory jobFactory;

	final static Logger logger = LoggerFactory.getLogger(JobScheduler.class);

	public JobFactory getJobFactory() {
		return jobFactory;
	}

	public void setJobFactory(JobFactory jobFactory) {
		this.jobFactory = jobFactory;
	}

	Scheduler delegate;
	Properties quartzProperties;
	boolean autoStart;
	int autoStartDelay;
	boolean startOnDemand;
	
	DataSource dataSource;

	public void init() throws Exception {
		StdSchedulerFactory factory = new StdSchedulerFactory();
		DbcpConnectionProvider cp = new DbcpConnectionProvider();
		cp.setDatasource(dataSource);
		DBConnectionManager.getInstance().addConnectionProvider("default", cp);

		factory.initialize(quartzProperties);
		delegate = (Scheduler) factory.getScheduler();
		delegate.setJobFactory(this.jobFactory);

		if (autoStart) {
			try {
				if (this.autoStartDelay > 0) {
					delegate.startDelayed(this.autoStartDelay);
				} else {
					delegate.start();
				}
			} catch (Exception e) {
				logger.error("Cannot start quartz scheduler. Reason is: "
						+ e.getMessage());
			}
		}
	}

	private void ensureDelegateIsStarted() throws SchedulerException {
		if ( this.startOnDemand && this.delegate != null && !this.delegate.isStarted()) {
			this.delegate.start();
		}
	}

	@Override
	public void start() throws Exception {
		delegate.start();
	}

	@Override
	public void stop() throws Exception {
		delegate.shutdown();
	}

	public Object getDelegate() throws Exception {
		this.ensureDelegateIsStarted();
		return this.delegate;
	}

	public Properties getQuartzProperties() {
		return quartzProperties;
	}

	public void setQuartzProperties(Properties quartzProperties) {
		this.quartzProperties = quartzProperties;
	}

	public boolean isAutoStart() {
		return autoStart;
	}

	public void setAutoStart(boolean autoStart) {
		this.autoStart = autoStart;
	}

	public int getAutoStartDelay() {
		return autoStartDelay;
	}

	public void setAutoStartDelay(int autoStartDelay) {
		this.autoStartDelay = autoStartDelay;
	}

	public DataSource getDataSource() {
		return dataSource;
	}

	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
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

	public boolean isStartOnDemand() {
		return startOnDemand;
	}

	public void setStartOnDemand(boolean startOnDemand) {
		this.startOnDemand = startOnDemand;
	}

}
