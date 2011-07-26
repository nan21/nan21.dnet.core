package net.nan21.dnet.core.presenter.service;
 
public class BaseDsDelegate<M, P, E> extends AbstractDsDelegate<M, P,E> {

	@Override
	public void execute(M ds) throws Exception {	
		this.execute(ds, null);
	}

	@Override
	public void execute(M ds, P params) throws Exception {		
	}
	
}