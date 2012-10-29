package net.nan21.dnet.core.business.service.setup;

import java.util.Iterator;
import java.util.List;

import net.nan21.dnet.core.api.setup.IInitDataProviderFactory;
import net.nan21.dnet.core.api.setup.ISetupParticipant;
import net.nan21.dnet.core.api.setup.ISetupTask;
import net.nan21.dnet.core.business.service.AbstractBusinessBaseService;

public abstract class AbstractBusinessSetupParticipant extends
		AbstractBusinessBaseService {

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
		return this.getApplicationContext().getId();
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

	@SuppressWarnings("unchecked")
	protected List<IInitDataProviderFactory> getDataProviderFactories() {
		return (List<IInitDataProviderFactory>) this.getApplicationContext()
				.getBean("osgiInitDataProviderFactories");
	}

}
