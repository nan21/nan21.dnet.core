package net.nan21.dnet.core.web.controller.ui;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.setup.ISetupParticipant;
import net.nan21.dnet.core.api.setup.IStartupParticipant;
import net.nan21.dnet.core.api.ui.extjs.IExtensionContentProvider;
import net.nan21.dnet.core.api.ui.extjs.IExtensionProvider;
import net.nan21.dnet.core.security.SessionUser;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.ModelAndView;

public class UiExtjsMainController extends AbstractUiExtjsController {

	List<IExtensionProvider> extensionProviders;
	List<IExtensionContentProvider> extensionContentProviders;
	

	protected List<ISetupParticipant> setupParticipants;
	protected List<IStartupParticipant> startupParticipants;
	
	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		for (ISetupParticipant sp: setupParticipants) {
			if (sp.hasWorkToDo()) {
				response.sendRedirect("/nan21.dnet.core.setup");
				return null;
			}
		}	
		
		try {
			SessionUser su = (SessionUser) SecurityContextHolder.getContext()
			.getAuthentication().getPrincipal();
		} catch (java.lang.ClassCastException e) {
			response.sendRedirect("/nan21.dnet.core.web/security/session/login");
			return null;
		}
		
		this._prepare(request, response);
		 
			
		
		// get extensions scripts 
		StringBuffer sb = new StringBuffer();
		for(IExtensionProvider provider : this.extensionProviders) {			
			sb.append("<script type=\"text/javascript\" src=\""+uiExtjsSettings.getUrlUiExtjs()+"/"+provider.getBundleName()+"/"+provider.getFileName()+"\"></script>\n" );
		}
		this.model.put("extensions", sb.toString());
		
		// get extensions content 
		StringBuffer sbc = new StringBuffer();
		for(IExtensionContentProvider  provider : this.extensionContentProviders ) {			
			sbc.append(provider.getContent());
		}
		this.model.put("extensionsContent", sbc.toString());
		
		return new ModelAndView(this.jspName, this.model);
	}

	public List<IExtensionProvider> getExtensionProviders() {
		return extensionProviders;
	}

	public void setExtensionProviders(
			List<IExtensionProvider> extensionProviders) {
		this.extensionProviders = extensionProviders;
	}

	public List<ISetupParticipant> getSetupParticipants() {
		return setupParticipants;
	}

	public void setSetupParticipants(List<ISetupParticipant> setupParticipants) {
		this.setupParticipants = setupParticipants;
	}

	public List<IStartupParticipant> getStartupParticipants() {
		return startupParticipants;
	}

	public void setStartupParticipants(List<IStartupParticipant> startupParticipants) {
		this.startupParticipants = startupParticipants;
	}

	public List<IExtensionContentProvider> getExtensionContentProviders() {
		return extensionContentProviders;
	}

	public void setExtensionContentProviders(
			List<IExtensionContentProvider> extensionContentProviders) {
		this.extensionContentProviders = extensionContentProviders;
	}
 
	
}
