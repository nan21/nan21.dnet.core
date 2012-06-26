package net.nan21.dnet.core.workflow.activiti_ext;

import java.lang.reflect.Field;

import org.activiti.engine.delegate.Expression;
import org.activiti.engine.impl.bpmn.behavior.MailActivityBehavior;
import org.activiti.engine.impl.bpmn.parser.AbstractBpmnParseListener;

import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.impl.pvm.process.ScopeImpl;
import org.activiti.engine.impl.util.xml.Element;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class DNetBpmnParseListener extends AbstractBpmnParseListener {

	@Autowired
	ApplicationContext appContext;

	@Override
	public void parseServiceTask(Element serviceTaskElement, ScopeImpl scope,
			ActivityImpl activity) {

		if (activity.getActivityBehavior() instanceof MailActivityBehavior) {
			DNetMailActivityBehavior target = new DNetMailActivityBehavior();
			MailActivityBehavior source = (MailActivityBehavior) activity
					.getActivityBehavior();
			target.setAppContext(appContext);

			this.copyField(source, target, "to");
			this.copyField(source, target, "from");

			this.copyField(source, target, "subject");
			this.copyField(source, target, "text");
			this.copyField(source, target, "html");

			this.copyField(source, target, "cc");
			this.copyField(source, target, "bcc");
			this.copyField(source, target, "charset");

			activity.setActivityBehavior(target);
		}
	}

	private void copyField(MailActivityBehavior source,
			DNetMailActivityBehavior target, String fieldName) {
		try {

			Field f1 = source.getClass().getDeclaredField(fieldName);
			f1.setAccessible(true);
			Expression v = (Expression) f1.get(source);

			Field f2 = target.getClass().getDeclaredField(fieldName);
			f2.setAccessible(true);
			f2.set(target, v);

		} catch (Exception e) {
			throw new RuntimeException("Cannot set field value " + fieldName
					+ " to send email in current workflow task. Reason: "
					+ e.getMessage());
		}
	}

	public ApplicationContext getAppContext() {
		return appContext;
	}

	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

}
