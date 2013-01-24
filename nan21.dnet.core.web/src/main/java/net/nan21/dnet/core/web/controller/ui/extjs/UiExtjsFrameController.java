package net.nan21.dnet.core.web.controller.ui.extjs;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.nan21.dnet.core.api.ISystemConfig;
import net.nan21.dnet.core.security.NotAuthorizedRequestException;
import net.nan21.dnet.core.security.SessionUser;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/frame", method = RequestMethod.GET)
public class UiExtjsFrameController extends AbstractUiExtjsController {

	private String cacheFolder;
	private Boolean cacheFolderWritable;

	/**
	 * Handler for a frame html page.
	 * 
	 * @param frame
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
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

		String[] tmp = request.getPathInfo().split("/");
		String frameFQN = tmp[tmp.length - 1];
		String bundle = tmp[tmp.length - 2];
		String[] t = frameFQN.split("\\.");
		String frameName = t[t.length - 1];

		model.put("item", frameFQN);
		model.put("itemSimpleName", frameName);
		model.put("bundle", bundle);

		// get extensions
		model.put("extensions",
				getExtensionFiles(frameFQN, uiExtjsSettings.getUrlModules()));

		model.put("extensionsContent", getExtensionContent(frameFQN));

		if (ISystemConfig.WORKING_MODE_DEV.equalsIgnoreCase(this
				.getSystemConfig().getWorkingMode())) {

			List<String> listCmp = new ArrayList<String>();
			List<String> listTrl = new ArrayList<String>();

			DependencyLoader loader = this.getDependencyLoader();
			loader.resolveFrameDependencies(bundle, frameName,
					(String) model.get("shortLanguage"), listCmp, listTrl);

			model.put("frameDependenciesCmp", listCmp);
			model.put("frameDependenciesTrl", listTrl);

		} else {
			if (this.cacheFolderWritable == null) {
				synchronized (this) {
					if (this.cacheFolderWritable == null) {

						if (this.cacheFolder == null) {
							this.cacheFolder = this.getUiExtjsSettings()
									.getCacheFolder();
						}

						File cf = new File(this.cacheFolder);
						if (!cf.exists()) {

							if (!cf.mkdirs()) {
								throw new Exception(
										"Cache folder "
												+ this.cacheFolder
												+ " does not exist and could not be created.");
							}
						}

						if (!cf.isDirectory() || !cf.canWrite()) {
							throw new Exception(
									"Cache folder "
											+ this.cacheFolder
											+ " is not writeable. Cannot pack and cache the frame dependencies for the configured `prod` working mode. ");
						}
						this.cacheFolderWritable = true;
					}
				}
			}
		}
		return new ModelAndView(this.jspName, model);
	}

	/**
	 * Handler to return the cached js file with the dependent components.
	 * 
	 * @param bundle
	 * @param frame
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/{bundle}/{frame}.js", method = RequestMethod.GET)
	@ResponseBody
	public String frameCmpJs(@PathVariable("bundle") String bundle,
			@PathVariable("frame") String frame, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		try {
			@SuppressWarnings("unused")
			SessionUser su = (SessionUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
		} catch (java.lang.ClassCastException e) {
			throw new NotAuthorizedRequestException("Not authenticated");
		}

		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		String fileName = frame + ".js";
		File f = new File(this.cacheFolder + "/" + bundle + "." + fileName);

		if (!f.exists()) {
			DependencyLoader loader = this.getDependencyLoader();
			loader.packFrameCmp(bundle, frame, f);
		}

		this.sendFile(f, response.getOutputStream());

		return null;
	}

	/**
	 * Handler to return the cached js file with the dependent translations.
	 * 
	 * @param bundle
	 * @param frame
	 * @param language
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/{bundle}/{language}/{frame}.js", method = RequestMethod.GET)
	@ResponseBody
	public String frameTrlJs(@PathVariable("bundle") String bundle,
			@PathVariable("frame") String frame,
			@PathVariable("language") String language,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		try {
			@SuppressWarnings("unused")
			SessionUser su = (SessionUser) SecurityContextHolder.getContext()
					.getAuthentication().getPrincipal();
		} catch (java.lang.ClassCastException e) {
			throw new NotAuthorizedRequestException("Not authenticated");
		}

		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		String fileName = frame + "-" + language + ".js";
		File f = new File(this.cacheFolder + "/" + bundle + "." + fileName);
		if (!f.exists()) {
			DependencyLoader loader = this.getDependencyLoader();
			loader.packFrameTrl(bundle, frame, language, f);
		}

		this.sendFile(f, response.getOutputStream());
		return null;
	}

	/**
	 * Helper method to create , configure and return an DependencyLoader
	 * instance
	 * 
	 * @return
	 */
	private DependencyLoader getDependencyLoader() {
		DependencyLoader loader = new DependencyLoader();
		loader.setUrlUiExtjsModulesI18n(getUiExtjsSettings()
				.getUrlModulesI18n());
		loader.setUrlUiExtjsModules(getUiExtjsSettings().getUrlModules());
		loader.setUrlUiExtjsModuleSubpath(getUiExtjsSettings()
				.getModuleSupath());
		return loader;
	}
}
