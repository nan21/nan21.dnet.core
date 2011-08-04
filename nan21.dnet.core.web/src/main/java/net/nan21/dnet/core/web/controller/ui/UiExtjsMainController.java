package net.nan21.dnet.core.web.controller.ui;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.setup.ISetupParticipant;
import net.nan21.dnet.core.api.ui.extjs.IExtensionProvider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

public class UiExtjsMainController extends AbstractUiExtjsController {

	List<IExtensionProvider> extensionProviders;

	protected List<ISetupParticipant> setupParticipants;
	
	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		this._prepare(request, response);
		 
		for (ISetupParticipant sp: setupParticipants) {
			if (sp.hasWorkToDo()) {
				response.sendRedirect("/nan21.dnet.core.setup");
				return null;
			}
		}		
		StringBuffer sb = new StringBuffer();
		for(IExtensionProvider provider : this.extensionProviders) {			
			sb.append("<script type=\"text/javascript\" src=\""+uiExtjsSettings.getUrlUiExtjs()+"/"+provider.getBundleName()+"/"+provider.getFileName()+"\"></script>\n" );
		}
		this.model.put("extensions", sb.toString());
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

	 
	
}
