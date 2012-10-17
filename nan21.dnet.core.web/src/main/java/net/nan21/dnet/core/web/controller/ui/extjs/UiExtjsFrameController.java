package net.nan21.dnet.core.web.controller.ui.extjs;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.ui.extjs.ExtensionScript;
import net.nan21.dnet.core.api.ui.extjs.IExtensionContentProviderFrame;
import net.nan21.dnet.core.api.ui.extjs.IExtensionProviderFrame;
import net.nan21.dnet.core.security.NotAuthorizedRequestException;
import net.nan21.dnet.core.security.SessionUser;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.ModelAndView;

public class UiExtjsFrameController extends AbstractUiExtjsController {

	List<IExtensionProviderFrame> extensionProviders;

	List<IExtensionContentProviderFrame> extensionContentProviders;

	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request,
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

		String[] tmp = request.getPathInfo().split("/");
		String item = tmp[tmp.length - 1];
		String bundle = tmp[tmp.length - 2];
		String[] t = item.split("\\.");

		model.put("item", item);
		model.put("itemSimpleName", t[t.length - 1]);
		model.put("bundle", bundle);

		StringBuffer sb = new StringBuffer();
		for (IExtensionProviderFrame provider : this.extensionProviders) {

			List<ExtensionScript> files = provider.getFiles(item);
			boolean isCss = false;
			for (ExtensionScript file : files) {
				String _loc = file.getLocation();
				int idx = _loc.lastIndexOf('.');
				if (idx == -1 || idx >= _loc.length()) {
					throw new Exception("Extension provider file `" + _loc
							+ "` should be of type .js or .css");
				}
				String _extension = _loc.substring(idx);

				if (_extension.equalsIgnoreCase(".css")) {
					isCss = true;
				} else if (_extension.equalsIgnoreCase(".js")) {
					isCss = false;
				} else {
					throw new Exception("Extension provider file `" + _loc
							+ "` should be of type .js or .css");
				}

				if (isCss) {
					if (!file.isRelativePath()) {
						sb.append("<link rel=\"stylesheet\" type=\"text/css\" href=\""
								+ file.getLocation() + "\"></link>\n");
					} else {
						sb.append("<link rel=\"stylesheet\" type=\"text/css\" href=\""
								+ uiExtjsSettings.getUrlModules()
								+ "/"
								+ file.getLocation() + "\"></link>\n");
					}
				} else {
					if (!file.isRelativePath()) {
						sb.append("<script type=\"text/javascript\" src=\""
								+ file.getLocation() + "\"></script>\n");
					} else {
						sb.append("<script type=\"text/javascript\" src=\""
								+ uiExtjsSettings.getUrlModules() + "/"
								+ file.getLocation() + "\"></script>\n");
					}
				}

			}

		}
		model.put("extensions", sb.toString());

		StringBuffer sbc = new StringBuffer();
		for (IExtensionContentProviderFrame provider : this.extensionContentProviders) {
			sbc.append(provider.getContent(item));
		}
		model.put("extensionsContent", sbc.toString());

		return new ModelAndView(this.jspName, model);
	}

	public List<IExtensionProviderFrame> getExtensionProviders() {
		return extensionProviders;
	}

	public void setExtensionProviders(
			List<IExtensionProviderFrame> extensionProviders) {
		this.extensionProviders = extensionProviders;
	}

	public List<IExtensionContentProviderFrame> getExtensionContentProviders() {
		return extensionContentProviders;
	}

	public void setExtensionContentProviders(
			List<IExtensionContentProviderFrame> extensionContentProviders) {
		this.extensionContentProviders = extensionContentProviders;
	}

}
