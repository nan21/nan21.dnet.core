package net.nan21.dnet.core.web.controller.ui.extjs;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.security.NotAuthorizedRequestException;
import net.nan21.dnet.core.security.SessionUser;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/frame", method = RequestMethod.GET)
public class UiExtjsFrameController extends AbstractUiExtjsController {

	@RequestMapping(value = "/{bundle}/{frameFQN}", method = RequestMethod.GET)
	protected ModelAndView home(@PathVariable("frameFQN") String frame,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {
			@SuppressWarnings("unused")
			SessionUser su = (SessionUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
		} catch (java.lang.ClassCastException e) {
			throw new NotAuthorizedRequestException("Not authenticated");
		}

		Map<String, Object> model = new HashMap<String, Object>();
		this._prepare(model, request, response);

		// configuring a path as/{bundle}/{frameFQN} doesn't work with current
		// spring
		String[] tmp = request.getPathInfo().split("/");
		String frameFQN = tmp[tmp.length - 1];
		String bundle = tmp[tmp.length - 2];
		String[] t = frameFQN.split("\\.");

		model.put("item", frameFQN);
		model.put("itemSimpleName", t[t.length - 1]);
		model.put("bundle", bundle);

		model.put("extensions",
				getExtensionFiles(frameFQN, uiExtjsSettings.getUrlModules()));

		model.put("extensionsContent", getExtensionContent(frameFQN));

		return new ModelAndView(this.jspName, model);
	}

}
