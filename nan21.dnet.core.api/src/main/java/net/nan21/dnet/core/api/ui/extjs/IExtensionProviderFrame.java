package net.nan21.dnet.core.api.ui.extjs;

import java.util.List;

public interface IExtensionProviderFrame {
	public List<ExtensionScript> getFiles(String targetFrame) throws Exception;
}
