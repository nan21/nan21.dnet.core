package net.nan21.dnet.core.api.ui.extjs;

public interface IExtensionContentProvider extends IExtensions {

	/**
	 * A list of extension content to be included in the target page. Extensions
	 * can be included in in the main application pages or in any frame.
	 * 
	 * If the target is one of the static constants from the parent interface
	 * {@link IExtensions} then the content is included in the respective main
	 * page, otherwise is included in the frame whose fully qualified name
	 * matches the target parameter value.
	 * 
	 * @param targetName
	 * @return
	 * @throws Exception
	 */
	public String getContent(String targetName) throws Exception;
}
