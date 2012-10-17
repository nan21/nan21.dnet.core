package net.nan21.dnet.core.web.controller.data;
 
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value="/java/asgn/{resourceName}.{dataFormat}")
public class BaseAsgnController<M,F,P> extends AbstractAsgnController<M,F,P> {

}
