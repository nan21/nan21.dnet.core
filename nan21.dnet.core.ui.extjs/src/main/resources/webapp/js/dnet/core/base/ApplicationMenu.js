Ext.ns("dnet.core.base");

/**
 * Contributed menus
 */
dnet.core.base.ApplicationMenu$ContributedMenus = [];

/**
 * Themes
 */
dnet.core.base.ApplicationMenu$Themes = [ {
	text : Dnet.translate("appmenuitem", "theme_aqua__lbl"),
	handler : function() {
		getApplication().changeCurrentTheme("aqua");
	}
}, {
	text : Dnet.translate("appmenuitem", "theme_gray__lbl"),
	handler : function() {
		getApplication().changeCurrentTheme("gray");
	}
}, {
	text : Dnet.translate("appmenuitem", "theme_blue__lbl"),
	handler : function() {
		getApplication().changeCurrentTheme("blue");
	}
} ]

/**
 * Languages
 */
dnet.core.base.ApplicationMenu$Languages = [ {
	text : "English",
	handler : function() {
		getApplication().changeCurrentLanguage("en");
	}
}, {
	text : "Romană",
	handler : function() {
		getApplication().changeCurrentLanguage("ro");
	}
} ]

/**
 * Help items
 */
dnet.core.base.ApplicationMenu$HelpItems = [ {
	text : Dnet.translate("appmenuitem", "frameInspector__lbl"),
	handler : function() {
		(new dnet.core.base.FrameInspector({})).show();
	}
}, "-", {
	text : Dnet.translate("appmenuitem", "about__lbl"),
	handler : function() {
		(new Ext.Window({
			width : 300,
			height : 250,
			title : "About",
			tpl : dnet.core.base.TemplateRepository.APPLICATION_ABOUT_BOX,
			data : {
				dnetName : Dnet.name,
				dnetVersion : Dnet.version
			},
			closable : true,
			modal : true,
			resizable : false
		})).show();
	}
} ]

/**
 * User account management
 */
dnet.core.base.ApplicationMenu$UserAccount = [ {
	text : Dnet.translate("appmenuitem", "changepswd__lbl"),
	handler : function() {
		(new dnet.core.base.ChangePasswordWindow({})).show();
	}
}, {
	text : Dnet.translate("msg", "preferences_wdw"),
	handler : function() {
		(new dnet.core.base.UserPreferences()).show();
	}
}, {
	text : Dnet.translate("appmenuitem", "mysettings__lbl"),
	handler : function() {
		var bundle = "nan21.dnet.module.ad.ui.extjs";
		var frame = "net.nan21.dnet.module.ad.usr.frame.MyUserSettings_UI";
		var path = Dnet.buildUiPath(bundle, frame, false);
		getApplication().showFrame(frame, {
			url : path
		});
	}
} ];

/**
 * Session management
 */
dnet.core.base.ApplicationMenu$SessionControl = [ {
	text : "Authenticate",
	handler : function() {
		getApplication().doLockSession();
	}
}, {
	text : Dnet.translate("appmenuitem", "logout__lbl"),
	handler : function() {
		getApplication().doLogout();
	}
} ];

/**
 * Main application menu items
 */
dnet.core.base.ApplicationMenu$Items = [ {
	xtype : "splitbutton",
	text : Dnet.translate("appmenuitem", "myaccount__lbl"),
	menu : new Ext.menu.Menu({
		items : [ {
			text : Dnet.translate("appmenuitem", "theme__lbl"),
			menu : new Ext.menu.Menu({
				items : dnet.core.base.ApplicationMenu$Themes
			})
		}, {
			text : Dnet.translate("appmenuitem", "lang__lbl"),
			menu : new Ext.menu.Menu({
				items : dnet.core.base.ApplicationMenu$Languages
			})
		}, "-" ].concat(dnet.core.base.ApplicationMenu$UserAccount)
	})
}, {
	xtype : "splitbutton",
	text : Dnet.translate("appmenuitem", "session__lbl"),
	menu : new Ext.menu.Menu({
		items : dnet.core.base.ApplicationMenu$SessionControl
	})
}, "-", {
	xtype : "splitbutton",
	text : Dnet.translate("appmenuitem", "help__lbl"),
	menu : new Ext.menu.Menu({
		items : dnet.core.base.ApplicationMenu$HelpItems
	})

} ];

/**
 * Database menus
 */
Ext.define("dnet.core.base.DBMenu", {
	extend : "Ext.menu.Menu"
});

/**
 * Application header.
 */
Ext.define("dnet.core.base.ApplicationMenu", {
	extend : "Ext.toolbar.Toolbar",

	padding : 0,
	height : 50,
	ui : "main-app-menu",

	systemClientMenu : null,
	systemClientMenuAdded : null,

	dbMenu : null,
	dbMenuAdded : null,

	/**
	 * Set the user name in the corresponding element.
	 */
	setUserText : function(v) {
		try {
			this.items.get(
					"net.nan21.dnet.core.menu.ApplicationMenu$Item$UserName")
					.setText(v);
		} catch (e) {
		}
	},

	/**
	 * Set the client name in the corresponding element.
	 */
	setClientText : function(v) {
		try {
			this.items.get(
					"net.nan21.dnet.core.menu.ApplicationMenu$Item$ClientName")
					.setText(v);
		} catch (e) {
		}
	},

	/**
	 * Create the application logo element using the URL set in Dnet.logoUrl
	 */
	_createAppLogo_ : function() {
		return {
			xtype : "container",
			height : 48,
			width : 120,
			style : "background: url('" + Dnet.logoUrl
					+ "') no-repeat ;background-position:center;  "
		}
	},

	/**
	 * Create the application's product info element using the corresponding
	 * Dnet properties
	 */
	_createAppInfo_ : function() {
		return {
			xtype : "tbtext",
			id : "net.nan21.dnet.core.menu.ApplicationMenu$Item$ProductInfo",
			text : "<span>" + Dnet.name + " </span><br><span>"
					+ Dnet.translate("appmenuitem", "version__lbl") + ": "
					+ Dnet.version + "</span></span>"
		};
	},

	/**
	 * Create the header's left part
	 */
	_createLeft_ : function() {
		return [ this._createAppLogo_(), {
			xtype : "tbspacer",
			width : 10
		} ];
	},

	/**
	 * Create the header's middle part
	 */
	_createMiddle_ : function() {
		return dnet.core.base.ApplicationMenu$Items;
	},

	/**
	 * Create the header's right part
	 */
	_createRight_ : function() {
		return [ "->", {
			xtype : "tbtext",
			id : "net.nan21.dnet.core.menu.ApplicationMenu$Item$UserLabel",
			text : Dnet.translate("appmenuitem", "user__lbl")
		}, {
			xtype : "tbtext",
			id : "net.nan21.dnet.core.menu.ApplicationMenu$Item$UserName",
			text : "-",
			style : "font-weight:bold;"
		}, "-", {
			xtype : "tbtext",
			id : "net.nan21.dnet.core.menu.ApplicationMenu$Item$ClientLabel",
			text : Dnet.translate("appmenuitem", "client__lbl")
		}, {
			xtype : "tbtext",
			id : "net.nan21.dnet.core.menu.ApplicationMenu$Item$ClientName",
			text : "-",
			style : "font-weight:bold;"
		}, {
			xtype : "tbspacer",
			width : 20
		}, this._createAppInfo_() ];
	},

	initComponent : function(config) {

		var _items = [].concat(this._createLeft_(), this._createMiddle_(), this
				._createRight_());

		this.systemClientMenuAdded = false;

		var cfg = {
			border : false,
			frame : false,
			items : _items
		};

		Ext.apply(this, cfg);
		this.callParent(arguments);

		this.on("afterrender", function() {
			Ext.Function.defer(this._insertDBMenus_, 500, this);
		}, this);
	},

	/**
	 * System client menu management. A system client can manage application
	 * clients (tenants). This feature will be moved in future to a stand-alone
	 * system module where a platform administrator can manage clients as well
	 * as other platform level management tasks.
	 */
	createSystemClientMenu : function() {
		var _items = [{
			text : "Clients management",
			handler : function() {
				var bundle = "nan21.dnet.module.ad.ui.extjs";
				var frame = "net.nan21.dnet.module.ad.client.frame.Client_UI";
				var path = Dnet.buildUiPath(bundle, frame, false);
				getApplication().showFrame(frame, {
					url : path
				});
			}
		}, {
			text : Dnet.translate("appmenuitem", "dbchangelog__lbl"),
			handler : function() {
				var bundle = "nan21.dnet.module.ad.ui.extjs";
				var frame = "net.nan21.dnet.module.ad.system.frame.DbChangeLog_UI";
				var path = Dnet.buildUiPath(bundle, frame, false);
				getApplication().showFrame(frame, {
					url : path
				});
			}
		}, {
			text : Dnet.translate("appmenuitem", "sysparams__lbl"),
			handler : function() {
				var bundle = "nan21.dnet.module.ad.ui.extjs";
				var frame = "net.nan21.dnet.module.ad.system.frame.SysParam_UI";
				var path = Dnet.buildUiPath(bundle, frame, false);
				getApplication().showFrame(frame, {
					url : path
				});
			}
		}];
		var _menu = {
			xtype : "splitbutton",
			text : "Tools",
			menu : new Ext.menu.Menu({
				items : _items
			})
		};
		this.systemClientMenu = Ext.create('Ext.button.Split', _menu);
	},

	/**
	 * Add the system client menu to the menu bar
	 */
	addSystemClientMenu : function() {
		if (!this.systemClientMenuAdded) {
			this.createSystemClientMenu();
			if (this.dbMenu == null) {
				this.insert(2, this.systemClientMenu);
			} else {
				this.insert(2 + this.dbMenu.length, this.systemClientMenu);
			}
			this.systemClientMenuAdded = true;
		}
	},

	/**
	 * Remove the system client menu from the menu bar
	 */
	removeSystemClientMenu : function() {
		if (this.systemClientMenuAdded) {
			this.remove(this.systemClientMenu);
			this.systemClientMenuAdded = false;
			this.systemClientMenu = null;
		}
	},

	/**
	 * Insert menu elements loaded from database.
	 */
	_insertDBMenus_ : function() {
		if (this.rendered && this.dbMenu != null && this.dbMenuAdded !== true) {
			var l = this.dbMenu.length;
			for ( var i = 0; i < l; i++) {
				this.insert(2 + i, this.dbMenu[i]);
			}
			this.dbMenuAdded = true;

		}
	},

	/**
	 * Create a menu item which opens a standard application frame.
	 */
	_createFrameMenuItem_ : function(config) {
		var bundle_ = config.bundle;
		var frame_ = config.frame;
		var title_ = config.title;
		return {
			text : title_,
			handler : function() {
				var bundle = bundle_;
				var frame = frame_;
				var path = Dnet.buildUiPath(bundle, frame, false);
				getApplication().showFrame(frame, {
					url : path
				});
			}
		};
	},

	/**
	 * Create a menu from configuration object
	 */
	_createMenu_ : function(config) {
		return Ext.apply(
				{
					maybeShowMenu : function() {
						if (!this.menu.loader._isLoaded_) {
							if (!this.menu.loader._isLoading_) {
								this.menu.loader.load();
							}
							return false;
						} else {
							var me = this;
							if (me.menu && !me.hasVisibleMenu()
									&& !me.ignoreNextClick) {
								me.showMenu();
							}
						}
					},
					menu : {
						loader : this._createLoader_({
							menuId : config.db_id
						}, true)

					}
				}, config);

	},

	/**
	 * Create a menu-item from configuration object
	 */
	_createMenuMenuItem_ : function(config) {
		return {
			text : config.title,
			deferExpandMenu : function() {
				if (!this.menu.loader._isLoaded_) {
					if (!this.menu.loader._isLoading_) {
						this.menu.loader.load();
					}
					return false;
				} else {
					var me = this;

					if (!me.menu.rendered || !me.menu.isVisible()) {
						me.parentMenu.activeChild = me.menu;
						me.menu.parentItem = me;
						me.menu.parentMenu = me.menu.ownerCt = me.parentMenu;
						me.menu.showBy(me, me.menuAlign,
								((!Ext.isStrict && Ext.isIE) || Ext.isIE6) ? [
										-2, -2 ] : undefined);
					}
				}

			},
			menu : {
				loader : this._createLoader_({
					menuItemId : config.db_id
				}, false)
			}
		};
	},

	/**
	 * Create a database menu items loader.
	 */
	_createLoader_ : function(params, autoload) {
		return {
			url : Dnet.dsAPI("MenuItemDs", "json").read,
			renderer : 'data',
			autoLoad : autoload,
			_isLoaded_ : false,
			_isLoading_ : false,
			listeners : {
				scope : this,
				beforeload : {
					fn : function(loader, options, eopts) {
						loader._isLoaded_ = false;
						loader._isLoading_ = true;
					}
				},
				load : {
					fn : function(loader, response, options, eopts) {
						var res = Ext.JSON.decode(response.responseText).data;
						var mitems = [];
						for ( var i = 0; i < res.length; i++) {
							var e = res[i];
							if (e.frame) {
								mitems.push(this._createFrameMenuItem_({
									db_id : e.id,
									title : e.title,
									frame : e.frame,
									bundle : e.bundle
								}));
							} else {
								mitems.push(this._createMenuMenuItem_({
									db_id : e.id,
									title : e.title
								}));
							}
						}
						loader.target.add(mitems);
						loader._isLoaded_ = true;
						loader._isLoading_ = false;
					}
				}
			},
			ajaxOptions : {
				method : "POST"

			},
			params : {
				data : Ext.JSON.encode(params),
				orderBy : Ext.JSON.encode([ {
					property : "sequenceNo",
					direction : "ASC"
				} ])
			}

		};
	}

});
