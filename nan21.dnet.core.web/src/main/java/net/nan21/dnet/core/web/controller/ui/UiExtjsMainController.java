package net.nan21.dnet.core.web.controller.ui;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
 
import org.springframework.web.servlet.ModelAndView;
 
public class UiExtjsMainController extends AbstractUiExtjsController {
 
	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		this._prepare(request, response);		 
		return new ModelAndView(this.jspName, this.model);			
	}

}
