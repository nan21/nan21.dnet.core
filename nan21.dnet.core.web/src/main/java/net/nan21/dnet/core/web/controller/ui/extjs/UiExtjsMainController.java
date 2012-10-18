package net.nan21.dnet.core.web.controller.ui.extjs;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.setup.ISetupParticipant;
import net.nan21.dnet.core.api.setup.IStartupParticipant;
import net.nan21.dnet.core.api.ui.extjs.IExtensionContentProvider;
import net.nan21.dnet.core.api.ui.extjs.IExtensionProvider;
import net.nan21.dnet.core.api.ui.extjs.IExtensions;
import net.nan21.dnet.core.security.SessionUser;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class UiExtjsMainController extends AbstractUiExtjsController {

	protected List<ISetupParticipant> setupParticipants;
	protected List<IStartupParticipant> startupParticipants;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	protected ModelAndView home(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		for (ISetupParticipant sp : setupParticipants) {
			if (sp.hasWorkToDo()) {
				response.sendRedirect("/nan21.dnet.core.setup");
				return null;
			}
		}

		try {
			@SuppressWarnings("unused")
			SessionUser su = (SessionUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();

		} catch (java.lang.ClassCastException e) {
			response.sendRedirect("/nan21.dnet.core.web/security/session/login");
			return null;
		}

		Map<String, Object> model = new HashMap<String, Object>();
		this._prepare(model, request, response);

		/* ========== extensions =========== */

		model.put(
				"extensions",
				getExtensionFiles(IExtensions.MAIN,
						uiExtjsSettings.getUrlCore()));

		model.put("extensionsContent", getExtensionContent(IExtensions.MAIN));

		String logoUrl = this.getSystemConfig()
				.getSysParamValue("APP_LOGO_URL");

		if (logoUrl != null && !logoUrl.equals("")) {
			model.put("logoUrl", logoUrl);
		}
		return new ModelAndView(this.jspName, model);
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

	public void setStartupParticipants(
			List<IStartupParticipant> startupParticipants) {
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
