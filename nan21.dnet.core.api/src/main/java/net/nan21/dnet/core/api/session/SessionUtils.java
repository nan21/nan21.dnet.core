package net.nan21.dnet.core.api.session;

import java.util.Date;

public class SessionUtils {

	public static String formatDateTime(Date date) {
		return Session.user.get().getPreferences().getDateTimeFormat().format(
				date);
	}

	public static String formatDate(Date date) {
		return Session.user.get().getPreferences().getDateFormat().format(date);
	}

	public static String formatTime(Date date) {
		return Session.user.get().getPreferences().getTimeFormat().format(date);
	}

}
