Ext.define("dnet.core.base.UserPreferences", {
	extend : "Ext.window.Window",

	initComponent : function(config) {  
		var cfg = {
			title : Dnet.translate("msg", "preferences_wdw"),
			border : true,
			width : 350,
			height:120,
			resizable : true,
			//closeAction : "hide",			 
			closable : true,
			constrain : true,
			buttonAlign : "center",
			fieldDefaults:{
		  	   labelAlign:"right",
		  	   labelWidth:180  
		  	},
			modal : true,
			layout:"form",
			items : [{
	            xtype: 'checkbox',
	            fieldLabel : Dnet.translate("msg", "remember_view_state"),
	            //value: getApplication().getSession().rememberViewState,
	            //checked: getApplication().getSession().rememberViewState,
	            listeners: {
	            	change: {
	            		scope:this,
	            		fn: function(field,nv,ov) {
	            			getApplication().getSession().rememberViewState = nv;
	            		}
	            	},
	            	afterrender: {
	            		scope:this,
	            		fn: function(field ) {
	            			field.setValue(getApplication().getSession().rememberViewState); // = nv;
	            		}
	            	}
	            } 
	        }],
			buttons : [{
				xtype:"button",
				text : Dnet.translate("tlbitem", "ok__lbl"),
				scope:this,
				handler: function() { this.close();}
			}]
		};

		Ext.apply(cfg, config);
		Ext.apply(this, cfg);
		this.callParent(arguments);
	}
});