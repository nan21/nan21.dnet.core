/*
 * NbsCore4ExtjsUi
 * Nan21 eBusiness Suite framework libraries for Extjs client
 * Copyright (C) 2008 Nan21 Electronics srl www.nan21.net
 * License: LGPL v3
 */

Ext.ns("dnet.base"); 
dnet.base.FrameNavigatorWithIframe = Ext.apply({}, {
 
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

		if (! (params && params.url)) {
			alert("Programming error: params.url not specified in showFrame!");
			return;
			if (!params) params = {};
			var type = getApplication().type;
			params.url = "ClientExtjs/index.jsp?type="+type+"-dlg&item="+frame;
		}

		var resourceType = (params.resourceType)? params.resourceType:"";
		var tabID = __CmpId__.FRAME_TAB_PREFIX+resourceType+frame;
		var ifrID = __CmpId__.FRAME_IFRAME_PREFIX+resourceType+frame;
		var vb = getApplication().getViewBody();

		if ( Ext.isEmpty(document.getElementById(ifrID)) &&  !Ext.isEmpty(window.frames[ifrID]) ) {
			delete window.frames[ifrID];
		}


        if (this.isFrameOpened(frame)) {
          if (!this.isFrameActive(frame)) {
        	  getApplication().getViewBody().activate(tabID);
          }
        } else {
          if (this.maxOpenTabs > 0 && ((vb.items.getCount()+1) == this.maxOpenTabs )) { // add one for the home tab
               Ext.Msg.alert('Warning','You have reached the maximum number of opened tabs ('+(this.maxOpenTabs)+').<br> It is not allowed to open more tabs.');
               return;
            }
          vb.add(new Ext.Panel({
                  title:(resourceType!="")?resourceType+":"+frame:frame
                 ,id: tabID
                 ,n21_iframeID:ifrID
                 ,autoScroll:true
                 ,layout:'fit'
                 ,closable:true
                 ,html:'<div style="width:100%;height:100%;overflow: hidden;" id="div_'+frame+'" ><iframe id="'+ifrID+'" name="'+ifrID+'" src="'+params.url+'" style="border:0;width:100%;height:100%;overflow: hidden" FRAMEBORDER="no"></iframe></div>'
                 ,listeners:{
                   beforeclose: { scope:this, fn: function(panel) {   onContentPanelClose(panel.initialConfig.n21_iframeID); } }
                 }
               }));
               vb.activate(tabID);
        }
      }
});

 