package net.nan21.dnet.core.api.setup;

import java.util.Iterator;
import java.util.List;

import net.nan21.dnet.core.api.ISystemConfig;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public abstract class AbstractSetupParticipant implements
		ApplicationContextAware {

	private ApplicationContext applicationContext;

	private ISystemConfig systemConfig;

	protected String targetName;
	protected List<ISetupTask> tasks;
	protected int ranking;

	public boolean hasWorkToDo() {
		if (tasks == null) {
			this.init();
		}
		return this.tasks.size() > 0;
	}

	protected abstract void init();

	public List<ISetupTask> getTasks() {
		if (tasks == null) {
			this.init();
		}
		return this.tasks;
	}

	public String getTargetName() {
		return targetName;
	}

	public void setTargetName(String targetName) {
		this.targetName = targetName;
	}

	public String getBundleId() {
		return this.applicationContext.getId();
	}

	public ISetupTask getTask(String taskId) {
		Iterator<ISetupTask> it = tasks.iterator();
		while (it.hasNext()) {
			ISetupTask t = it.next();
			if (t.getId().equals(taskId)) {
				return t;
			}
		}
		return null;
	}

	protected void beforeExecute() throws Exception {

	}

	public void execute() throws Exception {
		this.beforeExecute();
		this.onExecute();
		this.afterExecute();
	}

	protected void afterExecute() throws Exception {
	}

	protected abstract void onExecute() throws Exception;

	public int getRanking() {
		return ranking;
	}

	public void setRanking(int ranking) {
		this.ranking = ranking;
	}

	public int compareTo(ISetupParticipant sp) {
		return sp.getRanking() - this.ranking;
	}

	/**
	 * Get system configuration object. If it is null attempts to retrieve it
	 * from Spring context.
	 * 
	 * @return
	 */
	public ISystemConfig getSystemConfig() {
		if (this.systemConfig == null) {
			this.systemConfig = this.applicationContext
					.getBean(ISystemConfig.class);
		}
		return systemConfig;
	}

	/**
	 * Set system configuration object.
	 * 
	 * @param systemConfig
	 */
	public void setSystemConfig(ISystemConfig systemConfig) {
		this.systemConfig = systemConfig;
	}

	public ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	public void setApplicationContext(ApplicationContext applicationContext) {
		this.applicationContext = applicationContext;
	}

}
