package net.nan21.dnet.core.api.model;

import java.util.Map;

/**
 * Event data model. Services can fire events which can be handled by
 * event-handlers within the same bundle or different ones. This events are
 * published on the publish-subscribe model. Data is passed over in such an
 * event-data instance.
 * 
 * For example an entity service can fire an event on update so that other
 * services are notified and can react accordingly. In such a case the the event
 * would contain as source the entity canonical class name and as action
 * 'update'. Any other useful information (for example id's of updated entities
 * can be added in the data map)
 * 
 * @author amathe
 * 
 */
public class EventData {

	public static String PRE_INSERT_ACTION = "pre-insert";
	public static String POST_INSERT_ACTION = "post-insert";

	public static String PRE_UPDATE_ACTION = "pre-update";
	public static String POST_UPDATE_ACTION = "post-update";

	public static String PRE_DELETE_ACTION = "pre-delete";
	public static String POST_DELETE_ACTION = "post-delete";

	/**
	 * A key identifying the source of the event. Usually it is a class name,
	 * but can be whatever string.
	 * 
	 */
	private String source;

	/**
	 * An optional information regarding the source of the event, specifying the
	 * action which triggered this event. For example insert or update.
	 */
	private String action;

	/**
	 * Any other information which may be useful for the listeners, for example
	 * a list of ID's.
	 */
	private Map<String, Object> data;

	public EventData(String source) {
		super();
		this.source = source;
	}

	public EventData(String source, String action) {
		super();
		this.source = source;
		this.action = action;
	}

	public EventData(String source, String action, Map<String, Object> data) {
		super();
		this.source = source;
		this.action = action;
		this.data = data;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}

}
