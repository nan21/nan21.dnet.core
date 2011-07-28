package net.nan21.dnet.core.api.service;
 
public interface IDsDelegateRpcData<M> {
	public void execute(M ds) throws Exception;	
}
