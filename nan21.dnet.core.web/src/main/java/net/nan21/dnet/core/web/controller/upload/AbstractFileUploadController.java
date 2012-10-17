package net.nan21.dnet.core.web.controller.upload;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import net.nan21.dnet.core.web.controller.AbstractDnetController;

public abstract class AbstractFileUploadController extends
		AbstractDnetController {

	/**
	 * Collect the context parameters from request. By convention these start
	 * with "_p_".
	 * 
	 * ATTENTION!: Only the first value is considered.
	 * 
	 * @param request
	 * @return
	 */
	protected Map<String, String> collectParams(HttpServletRequest request) {
		@SuppressWarnings("unchecked")
		Map<String, String[]> paramMap = (Map<String, String[]>) request
				.getParameterMap();
		Map<String, String> result = new HashMap<String, String>();
		for (Map.Entry<String, String[]> e : paramMap.entrySet()) {
			if (e.getKey().startsWith("_p_")) {
				result.put(e.getKey(), e.getValue()[0]);
			}
		}
		return result;
	}

}
