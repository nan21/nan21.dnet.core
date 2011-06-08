/*
 * NbsCore4ExtjsUi
 * Nan21 eBusiness Suite framework libraries for Extjs client
 * Copyright (C) 2008 Nan21 Electronics srl www.nan21.net
 * License: LGPL v3
 */

Ext.ns("dnet.base");
dnet.base.FrameNavigator = Ext.apply({}, {
 
	 maxOpenTabs : -1
	
	,isFrameOpened:  function(frame) {
		 return !Ext.isEmpty(document.getElementById(__CmpId__.FRAME_IFRAME_PREFIX+frame))
	}
		
	,isFrameActive:  function(frame) {
		return (getApplication().getViewBody().getActiveTab().getId() == __CmpId__.FRAME_TAB_PREFIX);  
	}	
	
	
	,showFrame: function(frame, params) {				
		this._showFrameImpl(frame, params);
	}
	
	 
	,_showFrameImpl: function(frame, params) {
		
		var tabID = __CmpId__.FRAME_TAB_PREFIX+frame;
		 	
		var vb = getApplication().getViewBody();
		
		 

        if (this.isFrameOpened(frame)) {
          if (!this.isFrameActive(frame)) {           
        	  getApplication().getViewBody().activate(tabID);
          }
        } else {
          if (this.maxOpenTabs > 0 && ((vb.items.getCount()+1) == this.maxOpenTabs )) { // add one for the home tab
               Ext.Msg.alert('Warning','You have reached the maximum number of opened tabs ('+(this.maxOpenTabs)+').<br> It is not allowed to open more tabs.');
               return;
            }
          vb.add({
        	   xtype:frame
        	   ,closable:true
          });
           
               vb.activate(tabID);
        }
      }
});

 