/*
 * DNet eBusiness Suite
 * Project: nan21-dnet
 * Copyright: 2010 Nan21 Electronics SRL. All rights reserved.
 * http://dnet.nan21.net
 * Use is subject to license terms.
 */
package net.nan21.dnet.core.presenter.propertyeditors;

import java.beans.PropertyEditorSupport;

public class FloatEditor extends PropertyEditorSupport  {

    public FloatEditor() {
        super();
    }
    
    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        String input = (text != null ? text.trim() : null);
        if (input == null || input.equals("")  ) {
            // Treat empty String as null value.
            setValue(null);
            
        } else  {
            try {
                setValue(Float.parseFloat(text));
            } catch(Exception e) {
                throw new IllegalArgumentException("Invalid float value [" + text + "]");
            }
        }              
  
    }
 
    
}
