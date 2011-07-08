package net.nan21.dnet.core.presenter.service;

import org.springframework.transaction.annotation.Transactional;

import net.nan21.dnet.core.api.model.IDsModel;
import net.nan21.dnet.core.api.model.IDsParam;
import net.nan21.dnet.core.api.model.IModelWithId;
import net.nan21.dnet.core.api.service.IDsService;
import net.nan21.dnet.core.presenter.model.AbstractDsModel;

@Transactional
public class BaseDsService extends AbstractDsService<AbstractDsModel<?>, IDsParam, IModelWithId>
		implements IDsService<AbstractDsModel<?>, IDsParam>{
 
}
