package net.nan21.dnet.core.web.controller.ui.extjs;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.ui.extjs.IExtensions;
import net.nan21.dnet.core.security.NotAuthorizedRequestException;
import net.nan21.dnet.core.security.SessionUser;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class UiExtjsDashboardController extends AbstractUiExtjsController {

	@RequestMapping(value = "/dashboard", method = RequestMethod.GET)
	protected ModelAndView home(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		try {
			@SuppressWarnings("unused")
			SessionUser su = (SessionUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
		} catch (java.lang.ClassCastException e) {
			// anonymous user
			throw new NotAuthorizedRequestException("Not authenticated");
		}
		Map<String, Object> model = new HashMap<String, Object>();
		this._prepare(model, request, response);

		/* ========== extensions =========== */

		model.put(
				"extensions",
				getExtensionFiles(IExtensions.DASHBOARD,
						uiExtjsSettings.getUrlCore()));
		return new ModelAndView(this.jspName, model);
	}

}
