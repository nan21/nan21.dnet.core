package net.nan21.dnet.core.presenter.exception;

public class ActionNotSupportedException extends AbstractException {

  	private static final long serialVersionUID = 1L;
  	 
  	public ActionNotSupportedException() {
        super("Action not supported.");
    }
  	public ActionNotSupportedException(String message) {
  		super(message);
  	}
  	  
}