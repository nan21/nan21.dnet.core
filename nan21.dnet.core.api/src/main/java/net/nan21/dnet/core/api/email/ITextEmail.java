package net.nan21.dnet.core.api.email;

import net.nan21.dnet.core.api.exceptions.EmailException;

public interface ITextEmail extends IEmail {
	public IEmail setMsg(String msg) throws EmailException;
}
