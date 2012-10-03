package net.nan21.dnet.core.web.controller.ui.senchatouch;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

 
import net.nan21.dnet.core.security.SessionUser;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.ModelAndView;

public class UiSenchaTouchMainController extends AbstractUiSenchaTouchController {

	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

//		for (ISetupParticipant sp: setupParticipants) {
//			if (sp.hasWorkToDo()) {
//				response.sendRedirect("/nan21.dnet.core.setup");
//				return null;
//			}
//		}	
		
		try {
			SessionUser su = (SessionUser) SecurityContextHolder.getContext()
			.getAuthentication().getPrincipal();
			
		} catch (java.lang.ClassCastException e) {
			response.sendRedirect("/nan21.dnet.core.web/security/session/login");
			return null;
		}
		
		this._prepare(request, response);
		 
		
		// get extensions scripts 
//		StringBuffer sb = new StringBuffer();
//		for(IExtensionProvider provider : this.extensionProviders) {
//			List<ExtensionScript> files = provider.getFiles();
//			for(ExtensionScript file: files) {
//				if (!file.isRelativePath()) {
//					sb.append("<script type=\"text/javascript\" src=\""+file.getLocation()+"\"></script>\n" );
//				}else {
//					sb.append("<script type=\"text/javascript\" src=\""+uiExtjsSettings.getUrlUiExtjs()+"/"+
//							file.getLocation() +"\"></script>\n" );
//				}
//			}			
//		}
//		this.model.put("extensions", sb.toString());
		
		// get extensions content 
//		StringBuffer sbc = new StringBuffer();
//		for(IExtensionContentProvider  provider : this.extensionContentProviders ) {			
//			sbc.append(provider.getContent());
//		}
//		this.model.put("extensionsContent", sbc.toString());
		
		return new ModelAndView(this.jspName, this.model);
		
	}

}
