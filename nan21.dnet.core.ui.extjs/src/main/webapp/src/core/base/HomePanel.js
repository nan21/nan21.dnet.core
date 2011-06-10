/*
 * NbsCore4ExtjsUi
 * Nan21 eBusiness Suite framework libraries for Extjs client
 * Copyright (C) 2008 Nan21 Electronics srl www.nan21.net
 * License: LGPL v3
 */

Ext.ns("dnet.base");
dnet.base.HomePanel = Ext.extend(Ext.Panel , {
  
   _TEXT_TITLE : Dnet.translate("appmenuitem", "home__lbl")
  ,_TEXT_STD_MENU : Dnet.translate("appmenuitem", "appmenus__lbl")
  ,_TEXT_USR_MENU : Dnet.translate("appmenuitem", "bookmark__lbl")


  , _Menu_StdMenuId_: "dnet-application-view-menu-std-menu"
  , _Menu_UsrMenuId_: "dnet-application-view-menu-usr-menu"
  , _Menu_AccordeonId_: "dnet-application-view-menu-accordeon"

   ,initComponent:function(config) {
		var tr = dnet.base.TemplateRepository;
	    var menuConfig = [];
	    for(var k in Dnet.navigationTreeMenus) {
	    	menuConfig[menuConfig.length] = Dnet.navigationTreeMenus[k];
	    } 
		var navigAccordeonCfg = {
	          layout:'accordion'
        	,id:this._Menu_AccordeonId_
			,region:'west'
			,width:350
			,split:true
            ,minSize: 200
            ,maxSize: 500
            ,items:[]
        }

		for (var i=0; i < menuConfig.length; i++) {
            navigAccordeonCfg.items[i] = {title: menuConfig[i]["title"], layout:'fit', border:false, items:[
					 	{xtype:"dnetNavigationTree", id:"dnet-application-view-menu-"+menuConfig[i]["name"], withStdFilterHeader:true,loader_PreloadChildren: true						 	 
						 	,root: new Ext.tree.AsyncTreeNode({
						           text:'TreeRoot'
						               ,expanded:true
						               ,leaf: false
						               ,children: menuConfig[i]["children"]						     	      
						             })
						 	,listeners: {
									openMenuLink: {scope:this
										, fn: function(node) {										     
				                            var path = Dnet.buildUiPath(node.attributes._bundle_, node.attributes._frame_, false);
				                            getApplication().showFrame(node.attributes._frame_, {url:path  } );
										}
										}
								}
						}
					]};
		}
		  
        var cfg = {
           layout:"border"
          ,title:this._TEXT_TITLE
          ,items:[
              //{region:"center", frame:true, html:"<div style='text-align:center;width:100%;font-size:16px;font-weight:bold;padding-top:40px;'><span>Welcome to "+Dnet.name+"</span></div>" }
              {region:"center", frame:true, tpl:dnet.base.TemplateRepository.APPLICATION_HOME, data:{dnetName: Dnet.name, dnetVersion:Dnet.version} }
              ,{region:"south", border: false, frame:true,  height:20, tpl: tr.get(tr.HOMEPANEL_FOOTER)
	    	             	, data:{}, id:"dnet-application-view-footer" }
              ,navigAccordeonCfg
          ]
        }
		Ext.apply(this, cfg);
        dnet.base.HomePanel.superclass.initComponent.apply(this, arguments);
        this.on("activate", function(p) {Ext.getCmp(this._Menu_AccordeonId_).doLayout(true, false);}, this);
   }

});
Ext.reg("dnetHomePanel", dnet.base.HomePanel);
