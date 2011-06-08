Ext.ns("dnet.base");
dnet.base.ApplicationMenu = Ext.extend(Ext.Toolbar , {
	// userTxtID : null
	//,clientTxtID : null
	
	initComponent: function(config) {
	
		//this.userTxtID = Ext.id();
		//this.clientTxtID = Ext.id();

		
		var cfg = {
			border: false, frame: false, width:1000,height:40
			,items:[

			     /* company logo */
				{ xtype:"box", autoEl: {  tag: 'img', src: __STATIC_RESOURCE_URL_CORE__+'/resources/images/logo/logo.png' } }
 
				,{xtype:"spacer", width:20}
				,{xtype:"tbtext" , text: Dnet.translate("appmenuitem", "user__lbl") } /* , style:"font-weight:bold;" } */
				,{xtype:"tbtext" , text:"-", style:"font-weight:bold;", id: this.userTxtID }
				, "-"
				,{xtype:"tbtext" , text:Dnet.translate("appmenuitem", "client__lbl") } /*, style:"font-weight:bold;"  }*/
				,{xtype:"tbtext" , text:"-", style:"font-weight:bold;" , id: this.clientTxtID  }
				, "-"
				,{xtype:"splitbutton" , text:Dnet.translate("appmenuitem", "myaccount__lbl")
					,menu: new Ext.menu.Menu({
					        items: [
						        {text: Dnet.translate("appmenuitem", "changepswd__lbl"), handler:function() { ( new dnet.base.ChangePasswordWindow()).show();}}
						      // , {text: Dnet.translate("appmenuitem", "userprefs__lbl") }
					        ]
					   	})
				}	
				,{xtype:"splitbutton" , text:Dnet.translate("appmenuitem", "session__lbl")
					,menu: new Ext.menu.Menu({
					        items: [					        	 
						        {text: Dnet.translate("appmenuitem", "logout__lbl") , handler:function() { getApplication().doLogout();} }
						       , {text: Dnet.translate("appmenuitem", "lock__lbl"), iconCls:"icon-lock " , handler:function() { getApplication().doLockSession();} }
					        ]
					   	})
				}
				,{xtype:"splitbutton" , text:Dnet.translate("appmenuitem", "bookmark__lbl")
					,menu: new Ext.menu.Menu({
					        items: [
					        	 {text: Dnet.translate("appmenuitem", "managebookmark__lbl") , handler:function() {
 											var uiName = 'MyBookmark_UI';
 											var path = Dnet.uiUrl+"/frame/bd/"+uiName;
				                            getApplication().showFrame(uiName, {url:path  } );
									 } }
						        ,"-"
								, {text: Dnet.translate("appmenuitem", "calendar__lbl") , handler:function() {
 											var uiName = 'Calendar_UI';
 											var path = Dnet.uiUrl+"/spframe/crm/"+uiName;
				                            getApplication().showFrame(uiName, {url:path  } );
									 } }

					        ]
					   	})

				 }
				, "-"
				,{xtype:"splitbutton" , text:Dnet.translate("appmenuitem", "theme__lbl")
					,menu: new Ext.menu.Menu({
					        items: [
						         {text: Dnet.translate("appmenuitem", "theme_gray__lbl") , handler:function() { getApplication().changeCurrentTheme("gray"); } }
						       , {text: Dnet.translate("appmenuitem", "theme_blue__lbl") , handler:function() { getApplication().changeCurrentTheme("blue");  } }
						       , {text: Dnet.translate("appmenuitem", "theme_access__lbl") , handler:function() { getApplication().changeCurrentTheme("access");  } }
					        ]
					   	})
				}

				,{xtype:"splitbutton" , text:Dnet.translate("appmenuitem", "lang__lbl")
					,menu: new Ext.menu.Menu({
					        items: [

							 	{text: "English", handler:function() { getApplication().changeCurrentLanguage("en"); } }
						        ,{text: "Romană" , handler:function() { getApplication().changeCurrentLanguage("ro"); } }
					        ]
					   	})
				}
				, "-"
				,{xtype:"splitbutton" , text:Dnet.translate("appmenuitem", "help__lbl")
					,menu: new Ext.menu.Menu({
					        items: [
						         {text: Dnet.translate("appmenuitem", "about__lbl") 
								 	, handler:function() {
										( new Ext.Window({ width:300, height:350
												  ,title:"About"
												  ,tpl:dnet.base.TemplateRepository.APPLICATION_ABOUT_BOX, data:{dnetName: Dnet.name, dnetVersion:Dnet.version}
											      ,closable: true , modal:true , resizable:false
												})).show();
									 }
								  }
						      // , {text: 'License' , handler:function() {  } }
						      // , {text: 'Wiki' , handler:function() {  } }
					        ]
					   	})

				}
				, "->"
				,{xtype:"tbtext" , html:"<span style='align:right'><span style='font-weight:bold'>"+Dnet.name+" </span><br><span>"+Dnet.translate("appmenuitem", "version__lbl")+": "+Dnet.version+"</span></span>", cls:"app-header-text" }
				

				
				]
		}
		Ext.apply(cfg,config);
	    Ext.apply(this,cfg);
		 
		dnet.base.ApplicationMenu.superclass.initComponent.call(this);
		//this.userTxtID = Ext.id();
		//this.clientTxtID = Ext.id();
		 

	}

	,setUserText: function(v) {
		this.items.itemAt(3).setText(v);
	}
	,setClientText: function(v) {
		this.items.itemAt(6).setText(v);
	}
});



