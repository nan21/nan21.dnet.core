Ext.ns("dnet.core.base");

dnet.core.base.ApplicationMenu$ContributedMenus = [];
/* company logo + user info */

dnet.core.base.ApplicationMenu$LogoItems = [{
	xtype : "container",
	items : [Ext.create('Ext.Img', {
				src : __STATIC_RESOURCE_URL_CORE__ + "/resources/images/"
						+ __THEME__ + "/logo/logo.png",
				id : "net.nan21.dnet.core.menu.ApplicationMenu$Item$Logo",
				style : "vertical-align:middle;"
			})],
	style : "",
	width : 100
}, {
	xtype : "tbspacer",
	id : "net.nan21.dnet.core.menu.ApplicationMenu$Item$LogoSpacer",
	width : 20
}];

dnet.core.base.ApplicationMenu$Items = [
		{
			xtype : "tbspacer",				
			width : 10
		}, {
			xtype : "splitbutton",
			text : Dnet.translate("appmenuitem", "myaccount__lbl"),
			menu : new Ext.menu.Menu({
				items : [{
		
					text : Dnet.translate("appmenuitem", "theme__lbl"),
					menu : new Ext.menu.Menu({
								items : [{
									text : Dnet.translate("appmenuitem",
											"theme_gray__lbl"),
									handler : function() {
										getApplication().changeCurrentTheme("gray");
									}
								}, {
									text : Dnet.translate("appmenuitem",
											"theme_blue__lbl"),
									handler : function() {
										getApplication().changeCurrentTheme("blue");
									}
								}, {
									text : Dnet.translate("appmenuitem",
											"theme_access__lbl"),
									handler : function() {
										getApplication().changeCurrentTheme("access");
									}
								} ]
							})
			}, {

			text : Dnet.translate("appmenuitem", "lang__lbl"),
			menu : new Ext.menu.Menu({
						items : [{
									text : "English",
									handler : function() {
										getApplication()
												.changeCurrentLanguage("en");
									}
								}, {
									text : "Romană",
									handler : function() {
										getApplication()
												.changeCurrentLanguage("ro");
									}
								}]
					})
		}, "-", {
			text : Dnet.translate("appmenuitem", "changepswd__lbl"),
			handler : function() {
				(new dnet.core.base.ChangePasswordWindow({})).show();
			}
		}, "-", {
			text : Dnet.translate("appmenuitem", "mysettings__lbl"),
			handler : function() {
				var bundle = "nan21.dnet.module.ad.ui.extjs";
				var frame = "net.nan21.dnet.module.ad.usr.frame.MyUserSettings_UI";
				var path = Dnet.buildUiPath(bundle, frame, false);
				getApplication().showFrame(frame, {
							url : path
						});
			}
		}/*
			 * ,{ text : Dnet.translate("msg", "preferences_wdw"), handler :
			 * function() { (new dnet.core.base.UserPreferences({})).show(); } }
			 */

		]
	})
}, {
	xtype : "splitbutton",
	text : Dnet.translate("appmenuitem", "session__lbl"),
	menu : new Ext.menu.Menu({
				items : [{
							text :"Authenticate",
							handler : function() {
								getApplication().doLockSession();
							}
						},{
							text : Dnet.translate("appmenuitem", "logout__lbl"),
							handler : function() {								
								getApplication().doLogout();
							}
						}
						]
			})
}

, "-"

, {
	xtype : "splitbutton",
	text : Dnet.translate("appmenuitem", "help__lbl"),
	menu : new Ext.menu.Menu({
		items : [{
					text : Dnet.translate("appmenuitem", "frameInspector__lbl"),
					handler : function() {
						(new dnet.core.base.FrameInspector({})).show();
					}
				}, "-", {
					text : Dnet.translate("appmenuitem", "about__lbl"),
					handler : function() {
						(new Ext.Window({
							width : 300,
							height : 350,
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
				}]
	})

}, "->", {
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
} ];

Ext.define("dnet.core.base.DBMenu", {
			extend : "Ext.menu.Menu"

});

Ext.define("dnet.core.base.ApplicationMenu", {
	extend : "Ext.toolbar.Toolbar",
	padding : 0,
	height : 50,
	systemClientMenu : null,
	systemClientMenuAdded : null,

	dbMenu : null,
	dbMenuAdded : null,

	insertDBMenus : function() {
		if (this.rendered && this.dbMenu != null && this.dbMenuAdded !== true) {
			var l = this.dbMenu.length;
			for (var i = 0; i < l; i++) {
				this.insert(2 + i, this.dbMenu[i]);
			}
			this.dbMenuAdded = true;

		}
	},

	
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
	_createMenuMenuItem_ : function(config) {
		return {
			text : config.title,
			deferExpandMenu: function() {
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
			            me.menu.showBy(me, me.menuAlign, ((!Ext.isStrict && Ext.isIE) || Ext.isIE6) ? [-2, -2] : undefined);
			        }
				}
				 
		    },
			menu : {
				loader : this._createLoader_({
					menuItemId: config.db_id
				},false) 
			}
		};
	},
	_createMenu_ : function(config) {
		return Ext.apply({
			 
			maybeShowMenu: function(){
				if (!this.menu.loader._isLoaded_) {
					if (!this.menu.loader._isLoading_) {
						this.menu.loader.load();	
					}
					return false;
				} else {
					var me = this;
			        if (me.menu && !me.hasVisibleMenu() && !me.ignoreNextClick) {
			            me.showMenu();
			        }
				}
		        
		    },
			 	
			menu : {
				loader : this._createLoader_({
					menuId: config.db_id
				},true)
			  
			}
		},config);
		  
	},
	_createLoader_ : function(params, autoload) {
		
		return {
			url : Dnet.dsAPI("MenuItemDs", "json").read,
			renderer : 'data',
			autoLoad : autoload,
			_isLoaded_ : false,
			_isLoading_ : false,
			listeners : {
				scope : this,
				beforeload: {
					fn: function(loader, options, eopts) {
						loader._isLoaded_ = false;
						loader._isLoading_ = true;
					}
				},
				load : {
					fn : function(loader, response, options, eopts) {
						var res = Ext.JSON.decode(response.responseText).data;
						var mitems = [];
						for (var i = 0; i < res.length; i++) {
							var e = res[i];
							if (e.frame) {
								mitems.push(this._createFrameMenuItem_({
									db_id: e.id,
									title : e.title,
									frame: e.frame,
									bundle: e.bundle
								}));
							} else {
								mitems.push(this._createMenuMenuItem_({
									db_id: e.id,
									title : e.title
								}));
							}

						}
						loader.target.add(mitems);
						loader._isLoaded_ = true;
						loader._isLoading_ = false;
						
						//return false;
					}
				}
			},
			ajaxOptions : {
				method : "POST"

			},
			params : {
				data: Ext.JSON.encode(params),
				orderBy:Ext.JSON.encode([{ property :"sequenceNo", direction :"ASC"}])
			}
			
		};
	},

	initComponent : function(config) {
 
		var items = []; 
 
		items = items.concat(dnet.core.base.ApplicationMenu$Items);
		items = items.concat([
			{
				xtype : "tbspacer",				
				width : 20
			},{
				xtype : "tbtext",				
				id : "net.nan21.dnet.core.menu.ApplicationMenu$Item$ProductInfo",
				text: "<span>" + Dnet.name + " </span><br><span>"
						+ Dnet.translate("appmenuitem", "version__lbl") + ": "
						+ Dnet.version + "</span></span>" 
		}]);

		this.systemClientMenuAdded = false;

		var cfg = {
			border : false,
			frame : false,
			items : items
		};

		Ext.apply(this, cfg);
		this.callParent(arguments);

		this.on("afterrender", function() {
					Ext.Function.defer(this.insertDBMenus, 500, this);
				}, this);
	},

	setUserText : function(v) {
		try {
			this.items
					.get("net.nan21.dnet.core.menu.ApplicationMenu$Item$UserName")
					.setText(v);
		} catch (e) {
		} /* maybe customizations do not want this menu item */
	},

	setClientText : function(v) {
		try {
			this.items
					.get("net.nan21.dnet.core.menu.ApplicationMenu$Item$ClientName")
					.setText(v);
		} catch (e) {
		}
	},

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

	removeSystemClientMenu : function() {
		if (this.systemClientMenuAdded) {
			this.remove(this.systemClientMenu);
			this.systemClientMenuAdded = false;
			this.systemClientMenu = null;
		}
	},

	createSystemClientMenu : function() {
		this.systemClientMenu = Ext.create('Ext.button.Split', {
			xtype : "splitbutton",
			text : "Tools",
			menu : new Ext.menu.Menu({
				items : [{
					text : "Clients management",
					handler : function() {
						var bundle = "nan21.dnet.module.ad.ui.extjs";
						var frame = "net.nan21.dnet.module.ad.client.frame.Client_UI";
						var path = Dnet.buildUiPath(bundle, frame, false);
						getApplication().showFrame(frame, {
									url : path
								});
					}
				}]
			})
		});
	}

});