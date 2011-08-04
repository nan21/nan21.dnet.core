/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.api.session;

import java.text.SimpleDateFormat;

public class UserPreferences {
    private String dateFormatMask;
    private String dateTimeFormatMask;
    private String timeFormatMask;
    
    private SimpleDateFormat dateFormat;
    private SimpleDateFormat dateTimeFormat;
    private SimpleDateFormat timeFormat;
    
     
    private String language;
    /**
     * @return the dateFormatMask
     */
    public String getDateFormatMask() {
        return this.dateFormatMask;
    }
    /**
     * @param dateFormatMask the dateFormatMask to set
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
     * @param dateTimeFormatMask the dateTimeFormatMask to set
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
     * @param timeFormatMask the timeFormatMask to set
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
     * @param language the language to set
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

    
}
