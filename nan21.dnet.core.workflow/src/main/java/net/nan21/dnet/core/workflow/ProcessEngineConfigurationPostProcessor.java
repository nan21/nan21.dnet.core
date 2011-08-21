package net.nan21.dnet.core.workflow;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.impl.ProcessEngineImpl;
import org.activiti.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.activiti.engine.impl.form.FormTypes;
import org.activiti.engine.impl.scripting.JuelScriptEngineFactory;

public class ProcessEngineConfigurationPostProcessor {

	public ProcessEngineConfigurationPostProcessor(
			ProcessEngineConfiguration processEngineConfiguration ,
			ProcessEngine processEngine){

		//FormTypes ft=((ProcessEngineImpl)processEngine).getProcessEngineConfiguration().getFormTypes();
		ProcessEngineConfigurationImpl cfg = (ProcessEngineConfigurationImpl)processEngineConfiguration;
		cfg.getScriptingEngines().addScriptEngineFactory(new JuelScriptEngineFactory());
	}
	
}
