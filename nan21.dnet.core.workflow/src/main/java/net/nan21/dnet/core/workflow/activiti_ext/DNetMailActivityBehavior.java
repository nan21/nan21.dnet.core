package net.nan21.dnet.core.workflow.activiti_ext;

import net.nan21.dnet.core.api.email.IEmail;
import net.nan21.dnet.core.api.email.IEmailFactory;
import net.nan21.dnet.core.api.exceptions.EmailException;

import org.activiti.engine.ActivitiException;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.impl.bpmn.behavior.AbstractBpmnActivityBehavior;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

public class DNetMailActivityBehavior  extends AbstractBpmnActivityBehavior {

	 
	@Autowired
	ApplicationContext appContext;
	
	protected Expression to;
	protected Expression from;
	protected Expression cc;
	protected Expression bcc;
	protected Expression subject;
	protected Expression text;
	protected Expression html;
	protected Expression charset;

	public ApplicationContext getAppContext() {
		return appContext;
	}

	public void setAppContext(ApplicationContext appContext) {
		this.appContext = appContext;
	}

	@Override
	public void execute(ActivityExecution execution) {
		
		String toStr = getStringFromField(to, execution);
		String fromStr = getStringFromField(from, execution); 
		String ccStr = getStringFromField(cc, execution);
		String bccStr = getStringFromField(bcc, execution);
		String subjectStr = getStringFromField(subject, execution);
		String textStr = getStringFromField(text, execution);
		String htmlStr = getStringFromField(html, execution);
		//String charSetStr = getStringFromField(charset, execution);
		 
		String subject  = ( subjectStr != null) ? subjectStr : "";
		String body = (htmlStr!= null)? htmlStr : textStr;
		int type = 	(htmlStr!= null)? IEmail.TYPE_HTML : IEmail.TYPE_TEXT;
			
		try {
			
			if (type == IEmail.TYPE_HTML) {

				this.getAppContext().getBean(
						IEmailFactory.class).createHtmlEmail()
				.setHtmlMsg(body)		
				.addTo(toStr)
				.setFrom(fromStr)
				.addCc(ccStr)
				.addBcc(bccStr)
				.setSubject(subject)
				.send();
			} else {
				this.getAppContext().getBean(
						IEmailFactory.class).createTextEmail()
				.setMsg(body)		
				.addTo(toStr)
				.setFrom(fromStr)
				.addCc(ccStr)
				.addBcc(bccStr)
				.setSubject(subject)
				.send();				
			}  

		} catch (EmailException e) {
			throw new ActivitiException("Could not send e-mail", e);
		}
		leave(execution);
	}

	
	
	protected void setCharset(IEmail email, String charSetStr) {
		if (charset != null) {
			email.setCharset(charSetStr);
		}
	}

	protected String[] splitAndTrim(String str) {
		if (str != null) {
			String[] splittedStrings = str.split(",");
			for (int i = 0; i < splittedStrings.length; i++) {
				splittedStrings[i] = splittedStrings[i].trim();
			}
			return splittedStrings;
		}
		return null;
	}

	protected String getStringFromField(Expression expression,
			DelegateExecution execution) {
		if (expression != null) {
			Object value = expression.getValue(execution);
			if (value != null) {
				return value.toString();
			}
		}
		return null;
	}

}
