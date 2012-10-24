package net.nan21.dnet.core.api.ui.extjs;

import java.util.HashMap;
import java.util.Map;

/**
 * Simple content extension provider. Just declare an instance of this class as
 * a spring-bean with the proper configuration.
 * 
 * @author amathe
 * 
 */
public class SimpleExtensionContentProvider implements
		IExtensionContentProvider {

	private Map<String, String> extensions = new HashMap<String, String>();

	@Override
	public String getContent(String targetName) throws Exception {
		return extensions.get(targetName);
	}

	public void setExtensions(Map<String, String> extensions) {
		this.extensions = extensions;
	}

}
