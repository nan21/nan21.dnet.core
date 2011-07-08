/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.presenter.propertyeditors;

import java.beans.PropertyEditorSupport;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import net.nan21.dnet.core.domain.session.Session;
 

public class DateEditor  extends PropertyEditorSupport{

    SimpleDateFormat dateFormat;
    String dateFormatMask;
    
    public DateEditor() {
        super();
        this.dateFormat = Session.params.get().getServerDateFormat();
        this.dateFormatMask = Session.params.get().getServerDateFormatMask();
    } 

    public DateEditor(Object source) {
        super(source);
        this.dateFormat = Session.params.get().getServerDateFormat();
        this.dateFormatMask = Session.params.get().getServerDateFormatMask();
    }
    
    @Override
    public String getAsText() {                  
        return this.dateFormat.format((Date)this.getValue());
    }
    
    @Override
    public void setAsText(String text) throws IllegalArgumentException {         
        try {
            setValue(this.dateFormat.parse(text));
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid date value [" + text + "] for the expected format ["+this.dateFormatMask+"]");
        }
    }
    
}
