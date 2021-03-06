/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.api.session;

import java.io.Serializable;
import java.text.SimpleDateFormat;

import net.nan21.dnet.core.api.Constants;

public class UserPreferences implements Serializable {

	private static final long serialVersionUID = -7951956639299795918L;

	private SimpleDateFormat dateFormat;
	private SimpleDateFormat dateTimeFormat;
	private SimpleDateFormat timeFormat;

	private String dateFormatMask = Constants.JAVA_DATE_FORMAT;
	private String dateTimeFormatMask = Constants.JAVA_DATETIME_FORMAT;
	private String timeFormatMask = Constants.JAVA_TIME_FORMAT;

	private String extjsDateFormat = Constants.EXTJS_DATE_FORMAT;
	private String extjsTimeFormat = Constants.EXTJS_TIME_FORMAT;
	private String extjsDateTimeFormat = Constants.EXTJS_DATETIME_FORMAT;
	private String extjsAltFormats = Constants.EXTJS_ALT_FORMATS;
	private String javaDateFormat = Constants.JAVA_DATE_FORMAT;
	private String javaTimeFormat = Constants.JAVA_TIME_FORMAT;
	private String javaDateTimeFormat = Constants.JAVA_DATETIME_FORMAT;

	private String decimalSeparator = Constants.DECIMAL_SEPARATOR;
	private String thousandSeparator = Constants.THOUSAND_SEPARATOR;

	private String language;

	public UserPreferences() {
		this.dateFormat = new SimpleDateFormat(this.dateFormatMask);
		this.dateTimeFormat = new SimpleDateFormat(this.dateTimeFormatMask);
		this.timeFormat = new SimpleDateFormat(this.timeFormatMask);
	}

	/**
	 * @return the dateFormatMask
	 */
	public String getDateFormatMask() {
		return this.dateFormatMask;
	}

	/**
	 * @param dateFormatMask
	 *            the dateFormatMask to set
	 */
	public void setDateFormatMask(String dateFormatMask) {
		this.dateFormatMask = dateFormatMask;
		this.dateFormat = new SimpleDateFormat(this.dateFormatMask);
	}

	/**
	 * @return the dateTimeFormatMask
	 */
	public String getDateTimeFormatMask() {
		return this.dateTimeFormatMask;
	}

	/**
	 * @param dateTimeFormatMask
	 *            the dateTimeFormatMask to set
	 */
	public void setDateTimeFormatMask(String dateTimeFormatMask) {
		this.dateTimeFormatMask = dateTimeFormatMask;
		this.dateTimeFormat = new SimpleDateFormat(this.dateTimeFormatMask);
	}

	/**
	 * @return the timeFormatMask
	 */
	public String getTimeFormatMask() {
		return this.timeFormatMask;
	}

	/**
	 * @param timeFormatMask
	 *            the timeFormatMask to set
	 */
	public void setTimeFormatMask(String timeFormatMask) {
		this.timeFormatMask = timeFormatMask;
		this.timeFormat = new SimpleDateFormat(this.timeFormatMask);
	}

	/**
	 * @return the language
	 */
	public String getLanguage() {
		return this.language;
	}

	/**
	 * @param language
	 *            the language to set
	 */
	public void setLanguage(String language) {
		this.language = language;
	}

	/**
	 * @return the dateFormat
	 */
	public SimpleDateFormat getDateFormat() {
		return this.dateFormat;
	}

	/**
	 * @return the dateTimeFormat
	 */
	public SimpleDateFormat getDateTimeFormat() {
		return this.dateTimeFormat;
	}

	/**
	 * @return the timeFormat
	 */
	public SimpleDateFormat getTimeFormat() {
		return this.timeFormat;
	}

	public String getExtjsDateFormat() {
		return extjsDateFormat;
	}

	public void setExtjsDateFormat(String extjsDateFormat) {
		if (extjsDateFormat != null && !extjsDateFormat.equals("")) {
			this.extjsDateFormat = extjsDateFormat;
		}
	}

	public String getExtjsTimeFormat() {
		return extjsTimeFormat;
	}

	public void setExtjsTimeFormat(String extjsTimeFormat) {
		if (extjsTimeFormat != null && !extjsTimeFormat.equals("")) {
			this.extjsTimeFormat = extjsTimeFormat;
		}
	}

	public String getExtjsDateTimeFormat() {
		return extjsDateTimeFormat;
	}

	public void setExtjsDateTimeFormat(String extjsDateTimeFormat) {

		if (extjsDateTimeFormat != null && !extjsDateTimeFormat.equals("")) {
			this.extjsDateTimeFormat = extjsDateTimeFormat;
		}

	}

	public String getExtjsAltFormats() {
		return extjsAltFormats;
	}

	public void setExtjsAltFormats(String extjsAltFormats) {
		if (extjsAltFormats != null && !extjsAltFormats.equals("")) {
			this.extjsAltFormats = extjsAltFormats;
		}
	}

	public String getJavaDateFormat() {
		return javaDateFormat;
	}

	public void setJavaDateFormat(String javaDateFormat) {
		if (javaDateFormat != null && !javaDateFormat.equals("")) {
			this.javaDateFormat = javaDateFormat;
		}

	}

	public String getJavaTimeFormat() {
		return javaTimeFormat;
	}

	public void setJavaTimeFormat(String javaTimeFormat) {

		if (javaTimeFormat != null && !javaTimeFormat.equals("")) {
			this.javaTimeFormat = javaTimeFormat;
		}
	}

	public String getJavaDateTimeFormat() {
		return javaDateTimeFormat;
	}

	public void setJavaDateTimeFormat(String javaDateTimeFormat) {
		if (javaDateTimeFormat != null && !javaDateTimeFormat.equals("")) {
			this.javaDateTimeFormat = javaDateTimeFormat;
		}
	}

	public String getDecimalSeparator() {
		return decimalSeparator;
	}

	public void setDecimalSeparator(String decimalSeparator) {
		if (decimalSeparator != null && !decimalSeparator.equals("")) {
			this.decimalSeparator = decimalSeparator;
		}
	}

	public String getThousandSeparator() {
		return thousandSeparator;
	}

	public void setThousandSeparator(String thousandSeparator) {
		if (thousandSeparator != null && !thousandSeparator.equals("")) {
			this.thousandSeparator = thousandSeparator;
		}
	}

}
