package net.nan21.dnet.core.web.controller.ui;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
 
import org.springframework.web.servlet.ModelAndView;
 
public class UiExtjsFrameController extends AbstractUiExtjsController {
 
	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		this._prepare(request, response);
		
		String[] tmp = request.getPathInfo().split("/");  
		String item = tmp[tmp.length - 1];
		String[] t = item.split("\\.");
		
		// TODO: create a generic bundle-name lookup from item-name
		// Sync with Dnet.describeResource in Dnet.js
		String bundle = t[1]+"."+t[2]+"."+t[3]+"."+t[4]+"."+t[5]+".ui.extjs";
		
        model.put("item", item);
        model.put("itemSimpleName", t[t.length-1]);
        model.put("bundle", bundle);
        
		return new ModelAndView(this.jspName, this.model);
	}
}
