package net.nan21.dnet.core.web.controller.data;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
 
@Controller
@RequestMapping(value="/java/ds/{resourceName}.{dataFormat}")
public class DefaultDsController<M,F,P> extends AbstractDsWriteController<M,F,P> {
  
}
