/*
 * DNet
 * Copyright (C) 2008-2011 Nan21 Electronics srl www.nan21.net
 * License: GPL v3
 */


function getApplication() {
		if (!__application__ && !window.parent) { alert("Cannot find application."); return;}
		return (__application__)? __application__:window.parent.__application__;
	}

Ext.ns("dnet.base");
dnet.base.Application = Ext.apply({}, {

	 session: null
	,view: null
	,menu: null
	,useIframes: true
	,navigator: null
	,frameCallbacks: new Ext.util.MixedCollection()
	,frameRefs: new Ext.util.MixedCollection()
	,type: null

	,loginWindow: null
	,getSession: function() {return this.session;}
	,getView: function() {return this.view;}

	,getViewHome: function() { return Ext.getCmp(__CmpId__.APP_VIEW_HOME); }
	,getViewHeader: function() { return Ext.getCmp(__CmpId__.APP_VIEW_HEADER); }
	,getViewFooter: function() { return Ext.getCmp(__CmpId__.APP_VIEW_FOOTER); }
	,getViewBody: function() { return Ext.getCmp(__CmpId__.APP_VIEW_BODY); }

	
	/**
	 * Open the specified frame.
	 * @param options: 
	 * 	callback: the callback function to be executed after the frame is rendered.
	 *  params: the arguments used in callback call  
	 */
	,showFrame: function(frame, options) {
		var applyCallbackNow = this.navigator.isFrameOpened(frame);
		this.navigator.showFrame(frame, options);
		this.registerFrameCallback(frame, options);
		if (applyCallbackNow) {
			this.applyFrameCallback(frame, this.frameRefs.get(frame));
		}		
	}
	
	,registerFrameInstance : function(frame, theFrameObject) {
		if (this.frameRefs.containsKey(frame)) {
			this.frameRefs.removeKey(frame);
		}
		this.frameRefs.add(frame, theFrameObject);
	}
	
	,registerFrameCallback : function (frame, options) {
		if (options && options.callback) {
			this.frameCallbacks.add(frame, options);
		}		
	}
	
	,applyFrameCallback: function(frame, theFrameObject) {
		this.frameRefs.add(frame, theFrameObject);
		if (this.frameCallbacks.containsKey(frame)) {
			var opt = this.frameCallbacks.get(frame);			 
			opt.callback.call(theFrameObject, opt.params);
			this.frameCallbacks.removeKey(frame);
		}		
	}
	
	,run: function() {
		this.session = dnet.base.Session;
		if (this.useIframes) {
			this.navigator = dnet.base.FrameNavigatorWithIframe;
		} else {
			this.navigator = dnet.base.FrameNavigator;
		}
		this.navigator.maxOpenTabs = __MAX_OPEN_TABS__;
		
		if (this.loginWindow == null ) {
			this.loginWindow = new dnet.base.LoginWindow();			 
		}

		if (!this.session.isAuthenticated() ) {
			this.loginWindow.show();
			this.loginWindow.clearInvalid();
		} else if (this.session.locked ) {
			this.loginWindow.applyState_LockSession();
			this.showLoginView();
			this.loginWindow.getPasswordField().focus(false,200);
		} else {
			this.view.getLayout().setActiveItem(1);
			this.menu.setUserText(this.session.user.name );
			this.menu.setClientText(this.session.client.code);
		}
		
		
		 
		// load system parameters 
//		var sysParamDc = new fps.dc.SystemParameters({fetchSize:1000
//			,listeners: { "afterDoQuerySuccess":{   fn:  function(theDc) { 
//			  			      this.store.each(function(rec){
//			            getApplication().session.sysParams[rec.get("param_name").toLowerCase()] = rec.get("param_value")		        
//			        },this);
//			   }
//			  }}
//		});
 		
//		 sysParamDc.doQuery();
		    
		// restore the last selected client, stored in cookies 
//		 var scmno = readCookie(__COOKIE_SESSION_CLIENT_MNDNO__);
//		 var sci = readCookie(__COOKIE_SESSION_CLIENT_ID__);
//		var scd = readCookie(__COOKIE_SESSION_CLIENT_CD__);
//		if (sci && scd){
//		  getApplication().session.clientId = sci;
//		  getApplication().session.clientCd = scd;	
//		  getApplication().session.clientMandantenNo = scmno;
//		}   
		 		
		// show the dialog to confirm 
		//this.changeClient(false);
		 
	}

	

	
	,onLoginSuccess: function() {
		this.showMainApplicationView();
		this.loginWindow.hide();

		this.menu.setUserText(this.session.user.name );
		this.menu.setClientText(this.session.client.code);
	}
	
	,doLogout: function() {
		// close all tabs 
		this.loginWindow.applyState_Logout();
		this.showLoginView();
		this.loginWindow.getUserField().focus(false,200);
	}

	,doLockSession: function() {
        Ext.Ajax.request({
             method:"POST"
            //,params:{}
            ,scope:this
            ,url: Dnet.sessionAPI("json").lock
            ,timeout:600000

        });
		this.loginWindow.applyState_LockSession();
		this.showLoginView();
		this.loginWindow.getPasswordField().focus(false,200);
		//this.loginWindow.setUserName(this.session.user.userName);
	}

	,showLoginView: function() {		 
		this.view.getLayout().setActiveItem(0);	
		this.loginWindow.show();
	}
	
	,showMainApplicationView: function() {		
		this.view.doLayout(false,true);
		this.getViewBody().doLayout(false,true);
		this.view.getLayout().setActiveItem(1);		
	}
	
	,changeCurrentTheme: function(t) {
		//Ext.util.Cookies.set(__COOKIE_CURRENT_THEME__,t);
	    window.location.href = Dnet.uiUrl+"/?theme="+t
	}
    ,changeCurrentLanguage: function(l) {
		//Ext.util.Cookies.set(__COOKIE_CURRENT_THEME__,t);
	    window.location.href = Dnet.uiUrl+"/?lang="+l
	}
	
	,setFrameTabTitle:function(frame, title) {
		Ext.getCmp(__CmpId__.FRAME_TAB_PREFIX+frame).setTitle(title); 
	}
	
	
});
 
 