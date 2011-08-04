package net.nan21.dnet.core.business.service;

import java.util.Iterator;
import java.util.List;

import net.nan21.dnet.core.api.setup.ISetupTask;

public abstract class AbstractSetupParticipant extends AbstractBusinessDelegate {

	
	protected String targetName;
	protected List<ISetupTask> tasks; 
	
	public boolean hasWorkToDo() {
		if (tasks == null) {
			this.init();
		}
		return this.tasks.size()>0;
	}
	
	public List<ISetupTask> getTasks() {		 
		if (tasks == null) {
			this.init();
		}
		return this.tasks;
	}
	
	protected abstract void init();
	
	public String getTargetName() {
		return targetName;
	}

	public void setTargetName(String targetName) {
		this.targetName = targetName;
	}

	 
	public String getBundleId() {
		return this.appContext.getId();
	}
	
	 
	public ISetupTask getTask(String taskId) {
		 Iterator<ISetupTask> it = tasks.iterator();
		 while(it.hasNext()) {
			 ISetupTask t = it.next();
			 if (t.getId().equals(taskId)) {
				 return t;
			 }
		 }
		 return null;
	}
	
}
