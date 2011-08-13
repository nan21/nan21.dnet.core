package net.nan21.dnet.core.presenter.service;
 
public abstract class AbstractDsDelegate<M, P> extends
		AbstractDsProcessor<M, P> {
	
	public abstract void execute(M ds) throws Exception;
	public abstract void execute(M ds, P params) throws Exception;
 
}
