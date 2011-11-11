/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.presenter.propertyeditors;

import java.beans.PropertyEditorSupport;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import net.nan21.dnet.core.api.session.Session;
 

public class DateEditor  extends PropertyEditorSupport{

    SimpleDateFormat dateFormat;
    String dateFormatMask;
    
    List<SimpleDateFormat> altDateFormats;
    String altFormatMasks;
    
    public DateEditor() {
        super();
        this.initDefaults(); 
    } 

    public DateEditor(Object source) {
        super(source);
        this.initDefaults();
    }
    
    private void initDefaults() {
    	
    	//TODO: set altFormatMasks through a parameter in config file
    	
    	this.dateFormat = Session.params.get().getServerDateFormat();
        this.dateFormatMask = Session.params.get().getServerDateFormatMask();
        altDateFormats = new ArrayList<SimpleDateFormat>();
        altDateFormats.add(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss"));        
        altDateFormats.add(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
        altDateFormats.add(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm"));
        altDateFormats.add(new SimpleDateFormat("yyyy-MM-dd HH:mm"));
        altDateFormats.add(new SimpleDateFormat("yyyy-MM-dd"));
        altFormatMasks = "yyyy-MM-dd'T'HH:mm:ss, yyyy-MM-dd HH:mm:ss, yyyy-MM-dd'T'HH:mm, yyyy-MM-dd HH:mm, yyyy-MM-dd";
    }
    
    @Override
    public String getAsText() {                  
        return this.dateFormat.format((Date)this.getValue());
    }
    
    @Override
    public void setAsText(String text) throws IllegalArgumentException {
    	if(text==null || text.equals("")) {
    		setValue(null);
    		 
    	} else {    		
    		boolean ok = false;        
        	for (SimpleDateFormat df : this.altDateFormats) {
        		try {
        			setValue(df.parse(text));
        			ok = true;
        		} catch(Exception e) {
        			// ignore and try the next one
        		}
        	}
            if (!ok) {
            	throw new IllegalArgumentException("Date value [" + text + "] doesn't match any of the expected formats:  ["+this.altFormatMasks+"]");
            }
    	}
    	 
    }
    
    
    
    
}
