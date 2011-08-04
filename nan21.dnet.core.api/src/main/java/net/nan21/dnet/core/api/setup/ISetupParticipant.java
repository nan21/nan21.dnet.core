package net.nan21.dnet.core.api.setup;

import java.util.List;

import javax.persistence.EntityManager;

public interface ISetupParticipant {
	
	public EntityManager getEntityManager();
	public void setEntityManager(EntityManager em);
 
	public List<ISetupTask> getTasks();
	
	public ISetupTask getTask(String taskId);
	
	public String getBundleId();
	
	public String getTargetName();
	public void run() throws Exception;
	
	public boolean hasWorkToDo();
}
