package net.nan21.dnet.core.web.controller.data;

import net.nan21.dnet.core.api.model.IDsModel;
import net.nan21.dnet.core.api.model.IDsParam;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

 
@Controller
@Scope(value="request")
@RequestMapping(value="/java/lov/{resourceName}.{dataFormat}")
public class BaseLovController extends AbstractDsReadController<IDsModel<?>, IDsParam> {
  
}

