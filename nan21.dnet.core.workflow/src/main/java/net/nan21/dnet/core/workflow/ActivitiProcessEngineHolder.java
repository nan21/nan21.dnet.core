package net.nan21.dnet.core.workflow;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.activiti.engine.impl.scripting.JuelScriptEngineFactory;
import org.activiti.spring.ProcessEngineFactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import net.nan21.dnet.core.api.wf.IActivitiProcessEngineHolder;

public class ActivitiProcessEngineHolder implements
		IActivitiProcessEngineHolder {

	private ProcessEngine processEngine;
	@Autowired
	protected ApplicationContext applicationContext;
	private ProcessEngineConfigurationImpl processEngineConfiguration;

	@Override
	public Object getProcessEngine() throws Exception {
		if (processEngine == null) {

			ProcessEngineFactoryBean fb = new ProcessEngineFactoryBean();
			fb.setApplicationContext(applicationContext);
			fb.setProcessEngineConfiguration(processEngineConfiguration);
			this.processEngine = fb.getObject();

			ProcessEngineConfigurationImpl cfg = (ProcessEngineConfigurationImpl) processEngineConfiguration;
			cfg.getScriptingEngines().addScriptEngineFactory(
					new JuelScriptEngineFactory());

		}
		return this.processEngine;
	}

	public ProcessEngineConfigurationImpl getProcessEngineConfiguration() {
		return processEngineConfiguration;
	}

	public void setProcessEngineConfiguration(
			ProcessEngineConfigurationImpl processEngineConfiguration) {
		this.processEngineConfiguration = processEngineConfiguration;
	}

}
