/*
 * DNet
 * Copyright (C) 2008-2011 Nan21 Electronics srl www.nan21.net
 * License: GPL v3
 */

function getApplication() {
	if (!__application__ && !window.parent) {
		alert("Cannot find application.");
		return;
	}
	return (__application__) ? __application__ : window.parent.__application__;
}

dnet.base.Application = {
	 
	session : null,
	view : null,
	menu : null,
	useIframes : true,
	navigator : null,
	frameCallbacks : new Ext.util.MixedCollection(),
	frameRefs : new Ext.util.MixedCollection(),
	type : null

	,
	loginWindow : null,
	getSession : function() {
		return this.session;
	},
	getView : function() {
		return this.view;
	}

	,
	getViewHome : function() {
		return Ext.getCmp(__CmpId__.APP_VIEW_HOME);
	},
	getViewHeader : function() {
		return Ext.getCmp(__CmpId__.APP_VIEW_HEADER);
	},
	getViewFooter : function() {
		return Ext.getCmp(__CmpId__.APP_VIEW_FOOTER);
	},
	getViewBody : function() {
		return Ext.getCmp(__CmpId__.APP_VIEW_BODY);
	}

	/**
	 * Open the specified frame.
	 * 
	 * @param options:
	 *            callback: the callback function to be executed after the frame
	 *            is rendered. params: the arguments used in callback call
	 */
	,
	showFrame : function(frame, options) {
		var theFrame = this.navigator.getFrameInstance(frame);
		var applyCallbackNow = !Ext.isEmpty(theFrame);
		this.navigator.showFrame(frame, options);
		this.registerFrameCallback(frame, options);
		if (applyCallbackNow) {
			this.applyFrameCallback(frame, theFrame);
		}
	}

	,
	registerFrameCallback : function(frame, options) {
		if (options && !Ext.isEmpty(options.tocElement)
				&& Ext.isEmpty(options.callback)) {
			options.callback = function(params) {
				this._showTocElement_(params.tocElement);
			}
			options.params = {
				tocElement : options.tocElement
			}
		}
		if (options && options.callback) {
			this.frameCallbacks.add(frame, options);
		}
	}

	,
	applyFrameCallback : function(frame, theFrameObject) {
		if (this.frameCallbacks.containsKey(frame)) {
			var opt = this.frameCallbacks.get(frame);
			opt.callback.call(theFrameObject, opt.params);
			this.frameCallbacks.removeAtKey(frame);
		}
	}

	,
	run : function() {
		this.session = dnet.base.Session;
		if (this.useIframes) {
			this.navigator = dnet.base.FrameNavigatorWithIframe;
		} else {
			this.navigator = dnet.base.FrameNavigator;
		}
		this.navigator.maxOpenTabs = __MAX_OPEN_TABS__;

		if (this.loginWindow == null) {
			this.loginWindow = new dnet.base.LoginWindow( {});
		}

		if (!this.session.isAuthenticated()) {
			this.loginWindow.show();
			this.loginWindow.clearInvalid();
		} else if (this.session.locked) {
			this.loginWindow.applyState_LockSession();
			this.showLoginView();
			this.loginWindow.getPasswordField().focus(false, 200);
		} else {
			this.view.getLayout().setActiveItem(1);
			this.menu.setUserText(this.session.user.name);
			this.menu.setClientText(this.session.client.code);
		}

	}

	,
	onLoginSuccess : function() {
		this.showMainApplicationView();
		this.loginWindow.hide();

		//this.menu.setUserText(this.session.user.name);
		//this.menu.setClientText(this.session.client.code);
	}

	,
	doLogout : function() {
		Ext.Ajax.request( {
			method : "POST",
			scope : this,
			url : Dnet.sessionAPI("json").logout
		});
		this.loginWindow.applyState_Logout();
		this.showLoginView();
		this.loginWindow.getUserField().focus(false, 200);
	},
	doLockSession : function() {
		Ext.Ajax.request( {
			method : "POST",
			scope : this,
			url : Dnet.sessionAPI("json").lock,
			timeout : 600000
		});
		this.loginWindow.applyState_LockSession();
		this.showLoginView();
		this.loginWindow.getPasswordField().focus(false, 200);
	},
	showLoginView : function() {
		this.view.getLayout().setActiveItem(0);
		this.loginWindow.show();
	},
	showMainApplicationView : function() {
		//this.view.doLayout(false, true);
		//this.getViewBody().doLayout(false, true);
		this.view.getLayout().setActiveItem(1);
	},
	changeCurrentTheme : function(t) {
		window.location.href = Dnet.uiUrl + "/?theme=" + t
	},
	changeCurrentLanguage : function(l) {
		window.location.href = Dnet.uiUrl + "/?lang=" + l
	}

	,
	setFrameTabTitle : function(frame, title) {
		Ext.getCmp(__CmpId__.FRAME_TAB_PREFIX + frame).setTitle(title);
	}

};
