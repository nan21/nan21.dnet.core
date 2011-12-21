Ext.ns("dnet.base");

dnet.base.ApplicationMenu$ContributedMenus = [];
/* company logo + user info */

Ext.ns("dnet.base");
dnet.base.ApplicationMenu$LogoItems = [Ext.create('Ext.Img', {
			src : __STATIC_RESOURCE_URL_CORE__
					+ "/resources/images/logo/logo.png",
			id : "net.nan21.dnet.core.menu.ApplicationMenu$Item$Logo"
		}), {
	xtype : "tbspacer",
	id : "net.nan21.dnet.core.menu.ApplicationMenu$Item$LogoSpacer",
	width : 20
}, {
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
} /* , style:"font-weight:bold;" } */
, {
	xtype : "tbtext",
	id : "net.nan21.dnet.core.menu.ApplicationMenu$Item$ClientName",
	text : "-",
	style : "font-weight:bold;"
}, "-"];

Ext.ns("dnet.base");
dnet.base.ApplicationMenu$Items = [

{
	xtype : "splitbutton",
	text : Dnet.translate("appmenuitem", "myaccount__lbl"),
	menu : new Ext.menu.Menu({
				items : [{
							text : Dnet.translate("appmenuitem",
									"changepswd__lbl"),
							handler : function() {
								(new dnet.base.ChangePasswordWindow({})).show();
							}
						},{
							text : Dnet.translate("appmenuitem",
									"mysettings__lbl"),
							handler : function() {
								var bundle = "nan21.dnet.module.ad.ui.extjs";
								var frame = "net.nan21.dnet.module.ad.usr.frame.MyUserSettings_UI";
								var path = Dnet.buildUiPath(bundle, frame, false);
								getApplication().showFrame(frame, {
											url : path
										});
							}
						}
				// , {text: Dnet.translate("appmenuitem", "userprefs__lbl") }
				]
			})
}, {
	xtype : "splitbutton",
	text : Dnet.translate("appmenuitem", "session__lbl"),
	menu : new Ext.menu.Menu({
				items : [{
							text : Dnet.translate("appmenuitem", "logout__lbl"),
							handler : function() {
								getApplication().doLogout();
							}
						}
				// , {text: Dnet.translate("appmenuitem", "lock__lbl"),
				// iconCls:"icon-lock " , handler:function() {
				// getApplication().doLockSession();} }
				]
			})
}

, "-", {
	xtype : "splitbutton",
	text : Dnet.translate("appmenuitem", "theme__lbl"),
	menu : new Ext.menu.Menu({
				items : [{
							text : Dnet.translate("appmenuitem",
									"theme_capuccino__lbl"),
							handler : function() {
								getApplication().changeCurrentTheme("capuccino");
							}
						}
						,{
							text : Dnet.translate("appmenuitem",
									"theme_aqua__lbl"),
							handler : function() {
								getApplication().changeCurrentTheme("aqua");
							}
						},{
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
						}]
			})
}

, {
	xtype : "splitbutton",
	text : Dnet.translate("appmenuitem", "lang__lbl"),
	menu : new Ext.menu.Menu({
				items : [

				{
							text : "English",
							handler : function() {
								getApplication().changeCurrentLanguage("en");
							}
						}, {
							text : "Romană",
							handler : function() {
								getApplication().changeCurrentLanguage("ro");
							}
						}]
			})
}, "-"

, {
	xtype : "splitbutton",
	text : Dnet.translate("appmenuitem", "help__lbl"),
	menu : new Ext.menu.Menu({
		items : [{
			text : Dnet.translate("appmenuitem", "frameInspector__lbl"),
			handler : function() {
				(new dnet.base.FrameInspector({})).show();
			}
		},"-",{
			text : Dnet.translate("appmenuitem", "about__lbl"),
			handler : function() {
				(new Ext.Window({
							width : 300,
							height : 350,
							title : "About",
							tpl : dnet.base.TemplateRepository.APPLICATION_ABOUT_BOX,
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
	})

}

];

Ext.define("dnet.base.ApplicationMenu", {
	extend : "Ext.toolbar.Toolbar",
	padding : 0,
	height: 50,
	systemClientMenu : null,
	systemClientMenuAdded : null,
	initComponent : function(config) {

		var items = dnet.base.ApplicationMenu$LogoItems; // .concat(dnet.base.ApplicationMenu$ContributedMenus);

		var productInfo = ["->", {
			xtype : "tbtext",
			id : "net.nan21.dnet.core.menu.ApplicationMenu$Item$ProductInfo",
			cls : "app-header-text",
			html : "<span style='align:right'><span style='font-weight:bold'>"
					+ Dnet.name + " </span><br><span>"
					+ Dnet.translate("appmenuitem", "version__lbl") + ": "
					+ Dnet.version + "</span></span>"
		}];

		items = items.concat(dnet.base.ApplicationMenu$Items);
		items = items.concat(productInfo);

		 
		this.systemClientMenuAdded = false;

		var cfg = {
			border : false,
			frame : false,
			items : items
		};

		Ext.apply(this, cfg);
		this.callParent(arguments);
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
	
	addSystemClientMenu: function() {
		if (!this.systemClientMenuAdded) {
			this.createSystemClientMenu();
			this.insert(8,this.systemClientMenu);
			this.systemClientMenuAdded = true;
		}
	},
	
	removeSystemClientMenu: function() {
		if(this.systemClientMenuAdded) {
			this.remove(this.systemClientMenu);
			this.systemClientMenuAdded = false;
			this.systemClientMenu = null;
		}
	},
	
	createSystemClientMenu: function() {
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