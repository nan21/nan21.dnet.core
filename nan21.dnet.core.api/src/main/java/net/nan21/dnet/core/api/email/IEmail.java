package net.nan21.dnet.core.api.email;

import net.nan21.dnet.core.api.exceptions.EmailException;

public interface IEmail {
	
	public static final int TYPE_TEXT = 1; 
	public static final int TYPE_HTML = 2;
	
	public void setDebug(boolean d);
 
	public IEmail addBcc(String email) throws EmailException;

	public IEmail addBcc(String email, String name) throws EmailException;

	public IEmail addBcc(String email, String name, String charset)
			throws EmailException;

	public IEmail addCc(String email) throws EmailException;

	public IEmail addCc(String email, String name) throws EmailException;

	public IEmail addCc(String email, String name, String charset)
			throws EmailException;

	public void addHeader(String name, String value);

	public IEmail addReplyTo(String email) throws EmailException;

	public IEmail addReplyTo(String email, String name) throws EmailException;

	public IEmail addReplyTo(String email, String name, String charset)
			throws EmailException;

	public IEmail addTo(String email) throws EmailException;

	public IEmail addTo(String email, String name) throws EmailException;

	public IEmail addTo(String email, String name, String charset)
			throws EmailException;

	public IEmail setSubject(String aSubject);

	public String send() throws EmailException;

	public IEmail setMsg(String msg) throws EmailException;

	public IEmail setFrom(String email) throws EmailException;

	public IEmail setFrom(String email, String name) throws EmailException;

	public IEmail setFrom(String email, String name, String charset)
			throws EmailException;

	public void setCharset(String newCharset);
}
