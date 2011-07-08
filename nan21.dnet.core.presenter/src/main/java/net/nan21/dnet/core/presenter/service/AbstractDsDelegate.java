package net.nan21.dnet.core.presenter.service;
 
import net.nan21.dnet.core.presenter.model.AbstractDsModel;
 
public abstract class AbstractDsDelegate <M extends AbstractDsModel<?>>
		extends AbstractDsProcessor {	
	public abstract void execute(M ds) throws Exception ;
}
