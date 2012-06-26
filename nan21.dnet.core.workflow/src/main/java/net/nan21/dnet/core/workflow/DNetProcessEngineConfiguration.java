package net.nan21.dnet.core.workflow;

import java.util.List;

import org.activiti.engine.impl.bpmn.parser.BpmnParseListener;

import org.activiti.spring.SpringProcessEngineConfiguration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class DNetProcessEngineConfiguration extends
		SpringProcessEngineConfiguration {

	@Autowired
	ApplicationContext appContext;

	List<BpmnParseListener> parseListeners;

	public ApplicationContext getAppContext() {
		return appContext;
	}

	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

	public List<BpmnParseListener> getParseListeners() {
		return parseListeners;
	}

	public void setParseListeners(List<BpmnParseListener> parseListeners) {
		this.parseListeners = parseListeners;
	}

}
