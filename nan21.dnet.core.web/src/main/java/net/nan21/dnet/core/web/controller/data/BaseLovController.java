package net.nan21.dnet.core.web.controller.data;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

 
@Controller
@Scope(value="request")
@RequestMapping(value="/java/lov/{resourceName}.{dataFormat}")
public class BaseLovController<M, P> extends AbstractDsReadController<M,M,P> {
  
}

