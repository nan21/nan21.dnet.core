package net.nan21.dnet.core.web.controller.ui.senchatouch;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.security.SessionUser;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.ModelAndView;

public class UiSenchaTouchMainController extends
		AbstractUiSenchaTouchController {

	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		try {
			@SuppressWarnings("unused")
			SessionUser su = (SessionUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();

		} catch (java.lang.ClassCastException e) {
			response.sendRedirect("/nan21.dnet.core.web/security/session/login");
			return null;
		}

		this._prepare(request, response);

		return new ModelAndView(this.jspName, this.model);

	}

}
