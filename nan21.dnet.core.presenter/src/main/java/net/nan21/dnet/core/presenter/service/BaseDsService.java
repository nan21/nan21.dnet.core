package net.nan21.dnet.core.presenter.service;

import java.util.List;

import net.nan21.dnet.core.api.action.IActionContextFind;
import net.nan21.dnet.core.api.action.IActionResultFind;
import net.nan21.dnet.core.api.action.IActionResultSave;
import net.nan21.dnet.core.api.descriptor.IDsDescriptor;
import net.nan21.dnet.core.api.model.IDsModel;
import net.nan21.dnet.core.api.model.IDsParam;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.api.service.IDsService;

public class BaseDsService extends AbstractDsService<IDsModel<?>, IDsParam, IModelWithId>
		implements IDsService<IDsModel<?>, IDsParam>{

	

	@Override
	public IActionContextFind createContextFind(int resultStart,
			int resultSize, String orderByColumns, String orderBySense)
			throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	

	@Override
	public IDsDescriptor getDescriptor() {
		// TODO Auto-generated method stub
		return null;
	}

	

	@Override
	public IActionResultFind packResultFind(List<IDsModel<?>> data,
			IDsParam params, long totalCount) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public IActionResultSave packResultSave(List<IDsModel<?>> data,
			IDsParam params) {
		// TODO Auto-generated method stub
		return null;
	}

	 

	@Override
	public void setDescriptor(IDsDescriptor descriptor) throws Exception {
		// TODO Auto-generated method stub
		
	}

 
}
