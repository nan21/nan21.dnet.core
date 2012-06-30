package net.nan21.dnet.core.api.util;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class Duration {

	private static enum DurationType {
		MILLISECOND, SECOND, MINUTE, HOUR, DAY, WEEK
	};

	private static Map<DurationType, String> formatMap;
	static {
		formatMap = new HashMap<DurationType, String>();
		formatMap.put(DurationType.WEEK, "w");
		formatMap.put(DurationType.DAY, "d");
		formatMap.put(DurationType.HOUR, "h");
		formatMap.put(DurationType.MINUTE, "m");
		formatMap.put(DurationType.SECOND, "s");
		formatMap.put(DurationType.MILLISECOND, "ms");
	}
	private static final long SECOND_MS = 1000;
	private static final long MINUTE_MS = SECOND_MS * 60;
	private static final long HOUR_MS = MINUTE_MS * 60;
	private static final long DAY_MS = HOUR_MS * 24;

	public static String format(Date date1, Date date2) {
		long ms1 = date1.getTime();
		long ms2 = date2.getTime();
		return format(Math.abs(ms1 - ms2));
	}

	public static String format(long duration_in_ms) {
		Map<DurationType, String> map = formatMap;

		long milliseconds = duration_in_ms;
		long days = milliseconds / DAY_MS;
		milliseconds -= (days * DAY_MS);
		long hours = milliseconds / HOUR_MS;
		milliseconds -= (hours * HOUR_MS);
		long minutes = milliseconds / MINUTE_MS;
		milliseconds -= (minutes * MINUTE_MS);
		long seconds = milliseconds / SECOND_MS;
		milliseconds -= (seconds * SECOND_MS);

		StringBuilder buf = new StringBuilder();
		String sep = "";

		if (days > 0) {
			formatForDurationUnit(days, map.get(DurationType.DAY), buf, sep);
			sep = ", ";
		}

		if (hours > 0) {
			formatForDurationUnit(hours, map.get(DurationType.HOUR), buf, sep);
			sep = ", ";
		}

		if (minutes > 0) {
			formatForDurationUnit(minutes, map.get(DurationType.MINUTE), buf,
					sep);
			sep = ", ";
		}

		if (seconds > 0) {
			formatForDurationUnit(seconds, map.get(DurationType.SECOND), buf,
					sep);
			sep = ", ";
		}

		if (milliseconds > 0) {
			formatForDurationUnit(milliseconds, map
					.get(DurationType.MILLISECOND), buf, sep);
			sep = ", ";
		}

		return buf.toString();
	}

	private static void formatForDurationUnit(long count, String duration,
			StringBuilder buf, String separator) {

		if (count > 0) {
			buf.append(separator);
			buf.append(String.valueOf(count));
			buf.append(" ");
			buf.append(duration);
		}
	}

}
