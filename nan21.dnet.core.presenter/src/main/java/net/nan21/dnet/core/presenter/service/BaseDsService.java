package net.nan21.dnet.core.presenter.service;

import org.springframework.transaction.annotation.Transactional;

import net.nan21.dnet.core.api.model.IDsModel;
import net.nan21.dnet.core.api.model.IDsParam;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.api.service.IDsService;

@Transactional
public class BaseDsService extends AbstractDsService<IDsModel<?>, IDsParam, IModelWithId>
		implements IDsService<IDsModel<?>, IDsParam>{
 
}
