
Ext.ns("dnet.base");
dnet.base.HomePanelCr = Ext.extend(Ext.Panel , {
  
   _TEXT_TITLE : "Home"
  ,_TEXT_MENU_DS : "Data-source"
  ,_TEXT_MENU_DC : "Data-control"
  ,_TEXT_MENU_LOV : "LoV"
  ,_TEXT_MENU_ASGN : "Assignement"
  ,_TEXT_MENU_UI : "UI"


  , _Menu_MenuId_DS: "dnet-application-view-menu-ds-menu"
  , _Menu_MenuId_DC: "dnet-application-view-menu-dc-menu"
  , _Menu_MenuId_LOV: "dnet-application-view-menu-lov-menu"
  , _Menu_MenuId_ASGN: "dnet-application-view-menu-lov-asgn"
  , _Menu_MenuId_UI: "dnet-application-view-menu-ui-menu"

   ,initComponent:function(config) {
        var tr = dnet.base.TemplateRepository;

        var urlDs = Dnet.url+"/devCenter/t?transaction={\"action\":\"fetch\",\"resource\":\"Resource\",\"data\":{\"resourceGroup\":\"ds\",\"projectKey\":\"dnet\"}}";
        
        var urlDc = Dnet.url+"/devCenter/t?transaction={\"action\":\"fetch\",\"resource\":\"Resource\",\"data\":{\"resourceGroup\":\"dc\",\"projectKey\":\"dnet\"}}";
        
        var urlLov = Dnet.url+"/devCenter/t?transaction={\"action\":\"fetch\",\"resource\":\"Resource\",\"data\":{\"resourceGroup\":\"lov\",\"projectKey\":\"dnet\"}}";
        var urlAsgn = Dnet.url+"/devCenter/t?transaction={\"action\":\"fetch\",\"resource\":\"Resource\",\"data\":{\"resourceGroup\":\"asgn\",\"projectKey\":\"dnet\"}}";
        var urlUi = Dnet.url+"/devCenter/t?transaction={\"action\":\"fetch\",\"resource\":\"Resource\",\"data\":{\"resourceGroup\":\"ui\",\"projectKey\":\"dnet\"}}";

        var cfg = {
           layout:"border"
          ,title:this._TEXT_TITLE
          ,items:[
               {region:"center", border: true, frame:true, tpl: tr.get(tr.APPLICATION_HOME_CR), data:{}, id:"dnet-application-view-home-about" }
              ,{
                 layout:'accordion'
                ,region:'west'
                ,split:true
                ,width: 300
                ,minSize: 200
                ,maxSize: 500
                ,items:[

                        	 {title: this._TEXT_MENU_DS, layout:'fit', border:false, items:[
					              	{xtype:"dnetNavigationTree", id:this._Menu_MenuId_DCM, withStdFilterHeader:true,loader_PreloadChildren: true,loader_Url:urlDs
					              	  ,listeners: {
												refreshCatalog:{ fn: function() {
						                            	Ext.MessageBox.wait("Refreshing catalog ...");
														Ext.Ajax.request({
														   method:"POST"
														   ,failure:global_after_ajax_failure
															,success:this.afterRefreshCatalog
														    ,scope:this
														    ,url:Dnet.url+"/devCenter/t?transaction={\"action\":\"refresh\",\"resource\":\"Resource\",\"data\":{\"resourceGroup\":\"ds\",\"projectKey\":\"dnet\"}}"
														    ,timeout:600000
														});
														}
												},
						                        openMenuLink: {scope:this, fn: function(node) { 
						                            var id = node.attributes.id;						                            				                           
						                            var t = id.split(":");
						                           // var path = "index.jsp?type=dcr-ds&item="+t[2]+"&module="+t[1];						                            
						                            var path = Dnet.uiUrl+"/cr/ds/"+t[1]+"/"+t[2];
						                            getApplication().showFrame(t[2], {url:path , resourceType:"ds" } );
						                            } }}
						                   } ] }
					          ,{title: this._TEXT_MENU_DC, layout:'fit', border:false, items:[
					              	{xtype:"dnetNavigationTree", id:this._Menu_MenuId_DCV, withStdFilterHeader:true,loader_PreloadChildren: true,loader_Url:urlDc
					              	  ,listeners: {
									  			refreshCatalog:{ fn: function() {
						                            	Ext.MessageBox.wait("Refreshing catalog ...");
														Ext.Ajax.request({
														   method:"POST"
														   ,failure:global_after_ajax_failure
															,success:this.afterRefreshCatalog
														    ,scope:this
														    ,url:Dnet.url+"/devCenter/t?transaction={\"action\":\"refresh\",\"resource\":\"Resource\",\"data\":{\"resourceGroup\":\"dc\",\"projectKey\":\"dnet\"}}"
														    ,timeout:600000
														});
														}
												},
						                        openMenuLink: {scope:this, fn: function(node) { 
						                            var id = node.attributes.id;
						                            var t = id.split(":");
						                            //var path = "index.jsp?type=dcr-dc&item="+t[2]+"&module="+t[1];
						                            var path = Dnet.uiUrl+"/cr/dc/"+t[1]+"/"+t[2];
						                            getApplication().showFrame(t[2], {url:path, resourceType:"dc" } );
						                            } }}
						                   } ] }
					          ,{title: this._TEXT_MENU_LOV, layout:'fit', border:false, items:[
						              {xtype:"dnetNavigationTree", id:this._Menu_MenuId_LOV, withStdFilterHeader:true,loader_PreloadChildren: true,loader_Url:urlLov 
						                ,listeners: {
												refreshCatalog:{ fn: function() {
						                            	Ext.MessageBox.wait("Refreshing catalog ...");
														Ext.Ajax.request({
														   method:"POST"
														   ,failure:global_after_ajax_failure
															,success:this.afterRefreshCatalog
														    ,scope:this
														    ,url:Dnet.url+"/devCenter/t?transaction={\"action\":\"refresh\",\"resource\":\"Resource\",\"data\":{\"resourceGroup\":\"lov\",\"projectKey\":\"dnet\"}}"
														    ,timeout:600000
														});
														}
												},
						                        openMenuLink: {scope:this, fn: function(node) {
						                            var id = node.attributes.id;						                             		                          
						                            var t = id.split(":");
						                            //var path = "index.jsp?type=dcr-lov&item="+t[2]+"&module="+t[1];
						                            var path = Dnet.uiUrl+"/cr/lov/"+t[1]+"/"+t[2];
						                            getApplication().showFrame(t[2], {url:path , resourceType:"lov" } );
						                            } }}
						                   } ] }
						     ,{title: this._TEXT_MENU_ASGN, layout:'fit', border:false, items:[
						              {xtype:"dnetNavigationTree", id:this._Menu_MenuId_ASGN, withStdFilterHeader:true,loader_PreloadChildren: true,loader_Url:urlAsgn
						                ,listeners: {
												refreshCatalog:{ fn: function() {
						                            	Ext.MessageBox.wait("Refreshing catalog ...");
														Ext.Ajax.request({
														   method:"POST"
														   ,failure:global_after_ajax_failure
															,success:this.afterRefreshCatalog
														    ,scope:this
														    ,url:Dnet.url+"/devCenter/t?transaction={\"action\":\"refresh\",\"resource\":\"Resource\",\"data\":{\"resourceGroup\":\"asgn\",\"projectKey\":\"dnet\"}}"
														    ,timeout:600000
														});
														}
												},
						                        openMenuLink: {scope:this, fn: function(node) {
						                            var id = node.attributes.id;						                             		                          
						                            var t = id.split(":");
						                            //var path = "index.jsp?type=dcr-asgn&item="+t[2]+"&module="+t[1];
						                            var path = Dnet.uiUrl+"/cr/asgn/"+t[1]+"/"+t[2];
						                            getApplication().showFrame(t[2], {url:path , resourceType:"asgn" } );
						                            } }}
						                   } ] }
					          ,{title: this._TEXT_MENU_UI, layout:'fit', border:false, items:[
						              {xtype:"dnetNavigationTree", id:this._Menu_MenuId_DLG, withStdFilterHeader:true,loader_PreloadChildren: true,loader_Url:urlUi
						                ,listeners: {
												refreshCatalog:{ fn: function() {
						                            	Ext.MessageBox.wait("Refreshing catalog ...");
														Ext.Ajax.request({
														   method:"POST"
														   ,failure:global_after_ajax_failure
															,success:this.afterRefreshCatalog
														    ,scope:this
														    ,url:Dnet.url+"/devCenter/t?transaction={\"action\":\"refresh\",\"resource\":\"Resource\",\"data\":{\"resourceGroup\":\"ui\",\"projectKey\":\"dnet\"}}"
														    ,timeout:600000
														});
														}
												},
						                        openMenuLink: {scope:this, fn: function(node) {
						                            var id = node.attributes.id;
						                            var t = id.split(":");
						                            //var path = "index.jsp?type=dcr-ui&item="+t[2]+"&module="+t[1];
						                            var path = Dnet.uiUrl+"/cr/frame/"+t[1]+"/"+t[2];
						                            getApplication().showFrame(t[2], {url:path, resourceType:"ui"  } );
						                            } }}
						               } ] }
                   ]
              }
          ]
        }
     Ext.apply(this, cfg);
     dnet.base.HomePanelCr.superclass.initComponent.apply(this, arguments);
   }

});
Ext.reg("dnetHomePanelCr", dnet.base.HomePanelCr);
