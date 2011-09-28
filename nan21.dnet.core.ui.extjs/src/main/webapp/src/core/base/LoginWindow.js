Ext.define("dnet.base.LoginForm", {
	extend : "Ext.form.Panel",
	actionButton : null,
	initComponent : function(config) {
		this.actionButton = this.initialConfig.actionButton;
		this.actionButton.setHandler(this.doLogin, this);

		var cfg = {
			frame : true,
			bodyPadding: 10,
			fieldDefaults : {
				labelAlign : 'right',
				labelWidth : 100,
				msgTarget : 'side'
			},
			defaults : {
				anchor : '80%'
			},
			items : this._buildItems_()
		};
		Ext.apply(this, cfg);
		this.callParent(arguments);		
	},

	_buildItems_ : function() {
		return [ {
			xtype : "textfield",
			itemId : "usr",
			fieldLabel : Dnet.translate("msg", "login_user"),
			width : 150,
			selectOnFocus : true,
			allowBlank : false,
			value : getApplication().getSession().getUser().code,
			listeners : {
				change : {
					scope : this,
					fn : this.enableAction
				}
			}
		}, {
			xtype : "textfield",
			itemId : "pswd",
			fieldLabel : Dnet.translate("msg", "login_pswd"),
			width : 150,
			selectOnFocus : true,
			allowBlank : false,
			autoCreate : {
				tag : "input",
				type : "password",
				autocomplete : "off",
				size : "20"
			},
			listeners : {
				change : {
					scope : this,
					fn : this.enableAction
				}
			}
		}, {
			xtype : "textfield",
			itemId : "client",
			fieldLabel : Dnet.translate("msg", "login_client"),
			width : 150,
			selectOnFocus : true,
			allowBlank : false,
			value : getApplication().getSession().getClient().code,
			listeners : {
				change : {
					scope : this,
					fn : this.enableAction
				}
			}
		}, {
			xtype : "combo",
			itemId : "lang",
			fieldLabel : Dnet.translate("msg", "login_lang"),
			width : 150,
			selectOnFocus : true,
			forceSelection : true,
			allowBlank : false,
			triggerAction : "all",
			store : [ "English", "Romana" ],
			value : "English",
			listeners : {
				change : {
					scope : this,
					fn : this.enableAction
				}
			}
		}

		];
	},

	getActionButton : function() {
		return this.actionButton;
	},

	getUserField : function() {
		return this.getComponent("usr");
	},

	getPasswordField : function() {
		return this.getComponent("pswd");
	},

	getClientField : function() {
		return this.getComponent("client");
	},

	getLanguageField : function() {
		return this.getComponent("lang");
	},

	doLoginFailure : function(response, options) {
		Ext.Msg.show( {
			title : 'Authentication error',
			msg : response.responseText,
			buttons : Ext.MessageBox.OK,
			scope : this,
			icon : Ext.MessageBox.ERROR
		});

		this.getActionButton().enable();
	},

	doLoginSuccess : function(response, options) {
		var r = Ext.JSON.decode(response.responseText);
		var u = getApplication().getSession().getUser();
		var c = getApplication().getSession().getClient();
		u.name = r.data.name;
		c.id = r.data.clientId;
		getApplication().onLoginSuccess();
	},

	doLogin : function(btn, evnt) {
		var s = getApplication().getSession();
		var u = s.getUser();

		u.code = this.getUserField().getValue();
		s.client.code = this.getClientField().getValue();
		var p = {};

		p["user"] = this.getUserField().getValue();
		p["pswd"] = Ext.util.MD5(this.getPasswordField().getValue());
		p["client"] = this.getClientField().getValue();
		p["lang"] = this.getLanguageField().getValue();

		Ext.Ajax.request( {
			method : "POST",
			params : p,
			failure : this.doLoginFailure,
			success : this.doLoginSuccess,
			scope : this,
			url : Dnet.sessionAPI("json").login,
			timeout : 600000
		});
		this.getActionButton().disable();
	},

	clearFields : function() {
		this.items.each(function(item) {
			item.setValue(null);
		}, this);
	},

	clearInvalid : function() {
		this.getUserField().clearInvalid();
		this.getClientField().clearInvalid();
	},

	applyState_Logout : function() {
		this.getUserField().enable();

		this.getPasswordField().enable();
		this.getPasswordField().setValue(null);
		this.getPasswordField().clearInvalid();

		this.getClientField().enable();
		this.getClientField().setValue(null);
		this.getClientField().clearInvalid();

		this.getLanguageField().enable();
		this.getActionButton().disable();
	},

	applyState_LockSession : function() {
		this.getUserField().disable();
		this.getPasswordField().setValue(null);
		this.getPasswordField().clearInvalid();
		this.getClientField().disable();
		this.getLanguageField().disable();
		this.getActionButton().disable();
	},

	setUserName : function(v) {
		this.getUserField().setValue(v);
	},

	enableAction : function() {
		if (this.getForm().isValid()) {
			this.getActionButton().enable();
		} else {
			this.getActionButton().disable();
		}
	}
});

Ext.define("dnet.base.LoginWindow", {
	extend : "Ext.Window",

	initComponent : function(config) {

		var btn = Ext.create('Ext.Button', {
			text : Dnet.translate("msg", "login_btn"),
			disabled : true
		});

		var cfg = {
			title : Dnet.translate("msg", "login_title"),
			border : true,
			width : 350,
			resizable : false,
			closeAction : "hide",
			padding : 5,
			closable : false,
			constrain : true,			
			buttonAlign : "center",
			modal : true,
			items : new dnet.base.LoginForm( {
				actionButton : btn
			}),
			buttons : [ btn ]
		};

		Ext.apply(cfg, config);
		Ext.apply(this, cfg);
		this.callParent(arguments);
	},

	getLoginForm : function() {
		return this.items.getAt(0);
	},

	getActionButton : function() {
		return this.getLoginForm().getActionButton();
	},

	getUserField : function() {
		return this.getLoginForm().getUserField();
	},
	getPasswordField : function() {
		return this.getLoginForm().getPasswordField();
	},
	getClientField : function() {
		return this.getLoginForm().getClientField();
	},
	getLanguageField : function() {
		return this.getLoginForm().getLanguageField();
	},

	applyState_Logout : function() {
		this.getLoginForm().applyState_Logout();
	},

	applyState_LockSession : function() {
		this.getLoginForm().applyState_LockSession();
	},

	clearInvalid : function() {
		this.getLoginForm().clearInvalid();
	}

});