package net.nan21.dnet.core.api.email;

import net.nan21.dnet.core.api.exceptions.EmailException;

public interface IHtmlEmail extends IEmail {

	public IHtmlEmail setHtmlMsg(String aHtml) throws EmailException;

	public IHtmlEmail setTextMsg(String aText) throws EmailException;

}
