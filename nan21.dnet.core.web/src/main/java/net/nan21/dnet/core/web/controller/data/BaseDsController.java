package net.nan21.dnet.core.web.controller.data;


import net.nan21.dnet.core.api.model.IDsModel;
import net.nan21.dnet.core.api.model.IDsParam;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
 
@Controller
@RequestMapping(value="/java/ds/{resourceName}.{dataformat}")
public class BaseDsController extends AbstractDataWriteController<IDsModel<?>, IDsParam> {
  
}
