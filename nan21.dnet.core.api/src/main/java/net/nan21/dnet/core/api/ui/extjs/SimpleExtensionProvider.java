package net.nan21.dnet.core.api.ui.extjs;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Simple file extension provider. Just declare an instance of this class as a
 * spring-bean with the proper configuration.
 * 
 * @author amathe
 * 
 */
public class SimpleExtensionProvider implements IExtensionProvider {

	private Map<String, List<ExtensionFile>> extensions = new HashMap<String, List<ExtensionFile>>();

	@Override
	public List<ExtensionFile> getFiles(String targetName) throws Exception {
		return extensions.get(targetName);
	}

	public void setExtensions(Map<String, List<ExtensionFile>> extensions) {
		this.extensions = extensions;
	}

}
