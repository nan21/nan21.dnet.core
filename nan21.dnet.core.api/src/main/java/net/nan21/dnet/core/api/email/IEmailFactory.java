package net.nan21.dnet.core.api.email;

public interface IEmailFactory {
	public IEmail createEmail(int type);

	public ITextEmail createTextEmail();

	public IHtmlEmail createHtmlEmail();

	public IMultiPartEmail createMultiPartEmail();
}
