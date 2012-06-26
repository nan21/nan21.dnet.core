package net.nan21.dnet.core.email;

import java.util.Properties;

import net.nan21.dnet.core.api.email.IEmail;
import net.nan21.dnet.core.api.email.IEmailFactory;
import net.nan21.dnet.core.api.email.IHtmlEmail;
import net.nan21.dnet.core.api.email.IMultiPartEmail;
import net.nan21.dnet.core.api.email.ITextEmail;

public class EmailFactory implements IEmailFactory {

	private Properties mailServerProperties;

	@Override
	public IEmail createEmail(int type) {
		IEmail email = null;
		if (type == IEmail.TYPE_HTML) {
			email = new HtmlEmail();
			((Email)email).setMailServerProperties(mailServerProperties);
		} else  {
			email = new SimpleEmail();
			((Email)email).setMailServerProperties(mailServerProperties);
		}		  
		return email;
	}
	
	@Override
	public IHtmlEmail createHtmlEmail() {
		HtmlEmail email = new HtmlEmail();
		email.setMailServerProperties(mailServerProperties);
		return email;
	}

	@Override
	public IMultiPartEmail createMultiPartEmail() {
		MultiPartEmail email = new MultiPartEmail();
		email.setMailServerProperties(mailServerProperties);
		return email;

	}

	@Override
	public ITextEmail createTextEmail() {
		SimpleEmail email = new SimpleEmail();
		email.setMailServerProperties(mailServerProperties);
		return email;

	}

	public Properties getMailServerProperties() {
		return mailServerProperties;
	}

	public void setMailServerProperties(Properties mailServerProperties) {
		this.mailServerProperties = mailServerProperties;
	}

}
