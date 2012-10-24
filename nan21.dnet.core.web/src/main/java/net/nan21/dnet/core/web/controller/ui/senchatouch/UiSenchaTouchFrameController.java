package net.nan21.dnet.core.web.controller.ui.senchatouch;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.security.NotAuthorizedRequestException;
import net.nan21.dnet.core.security.SessionUser;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.ModelAndView;

public class UiSenchaTouchFrameController extends
		AbstractUiSenchaTouchController {

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

		this._prepare(request, response);

		String[] tmp = request.getPathInfo().split("/");
		String item = tmp[tmp.length - 1];
		String bundle = tmp[tmp.length - 2];
		String[] t = item.split("\\.");

		// TODO: create a generic bundle-name lookup from item-name
		// Sync with Dnet.describeResource in Dnet.js
		// String bundle = t[1]+"."+t[2]+"."+t[3]+"."+t[4]+"."+t[5]+".ui.extjs";

		model.put("item", item);
		model.put("itemSimpleName", t[t.length - 1]);
		model.put("bundle", bundle);

		// StringBuffer sb = new StringBuffer();
		// for (IExtensionProviderFrame provider : this.extensionProviders) {
		//
		// List<ExtensionScript> files = provider.getFiles(item);
		// for(ExtensionScript file: files) {
		// if (!file.isRelativePath()) {
		// sb.append("<script type=\"text/javascript\" src=\""+file.getLocation()+"\"></script>\n"
		// );
		// }else {
		// sb.append("<script type=\"text/javascript\" src=\""+uiExtjsSettings.getUrlUiExtjs()+"/"+
		// file.getLocation() +"\"></script>\n" );
		// }
		// }

		// if (item.equals(provider.getTargetFrame())) {
		// sb.append("<script type=\"text/javascript\" src=\""
		// + uiExtjsSettings.getUrlUiExtjs() + "/"
		// + provider.getBundleName() + "/"
		// + provider.getFileName() + "\"></script>\n");
		// }
		// }
		// this.model.put("extensions", sb.toString());
		//
		// StringBuffer sbc = new StringBuffer();
		// for (IExtensionContentProviderFrame provider :
		// this.extensionContentProviders) {
		// sbc.append(provider.getContent(item));
		// }
		// this.model.put("extensionsContent", sbc.toString());

		return new ModelAndView(this.jspName, this.model);
	}

}
