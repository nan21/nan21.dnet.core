package net.nan21.dnet.core.api.wf;

/**
 * On-demand process engine provider. Workaround to avoid instantiating an
 * Activiti process engine through the standard bean definition but only when
 * first requested. <br/>
 * The reason is that at initial startup when the database objects do not exist
 * yet ( and will be created by Eclipselink ) the process engine instantiation
 * will fail.
 * 
 * <br/>
 * Approach: export this holder as an osgi service and the implementation is
 * responsible to create (if not exist yet) and return the proper
 * org.activiti.engine.ProcessEngine
 * 
 * @author amathe
 * 
 */
public interface IActivitiProcessEngineHolder {

	public Object getProcessEngine() throws Exception;
}
