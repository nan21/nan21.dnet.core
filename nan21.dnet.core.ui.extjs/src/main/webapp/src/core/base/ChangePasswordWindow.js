

Ext.define("dnet.base.ChangePasswordForm" , {
	extend: "Ext.form.Panel",
	theButton: null,
	initComponent: function() {
	
		this.theButton = this.initialConfig.theButton;
		this.theButton.setHandler(this.doTask, this);
		 
		var cfg = {
			frame : true,
			bodyStyle : 'padding:5px 5px 0',
			fieldDefaults : {
				labelAlign : 'right',
				labelWidth : 130,
				msgTarget : 'side'
			},			 
			defaults : {
				anchor : '90%'
			},
			items : this._buildItems_()			
		};
        Ext.apply(this,cfg);
		dnet.base.ChangePasswordForm.superclass.initComponent.call(this, arguments);
 	},

	_buildItems_ : function() {
 		return [
				
				{xtype:"textfield", itemId:"opswd", fieldLabel:"Password", width:150, selectOnFocus: true, allowBlank: false
					,autoCreate: {tag: "input", type: "password", autocomplete: "off", size: "20" }
				 	,listeners: {change: {scope:this, fn:this.enableAction }}   }

				,{xtype:"textfield", itemId:"pswd1", fieldLabel:Dnet.translate("msg", "chpswd_pswd1"), width:150, selectOnFocus: true, allowBlank: false
			    	,autoCreate: {tag: "input", type: "password", autocomplete: "off", size: "20" }
			     	,listeners: {change: {scope:this, fn:this.enableAction }}   }
		     	
		     	,{xtype:"textfield", itemId:"pswd2", fieldLabel:Dnet.translate("msg", "chpswd_pswd2"), width:150, selectOnFocus: true, allowBlank: false
			    	,autoCreate: {tag: "input", type: "password", autocomplete: "off", size: "20" }
			     	,listeners: {change: {scope:this, fn:this.enableAction }}   }
		 ]; 		
 	}
	
 	,getTheButton: function() {
 		return this.theButton;
 	}
 	
 	,getCurrentPasswordField: function() {		 
		return this.getComponent("opswd");
	}
	
	,getPasswordField: function() {
		return this.getComponent("pswd1");
	}
	
	,getConfirmPasswordField: function() {
		return this.getComponent("pswd2");
	}

	,doOnFailure: function(response, options) {         
		 Ext.Msg.show({
	          msg: response.responseText
	         ,buttons: Ext.MessageBox.OK
	         ,scope:this
	         ,icon: Ext.MessageBox.ERROR
		 });

		 (response.responseText);
	}
	,doOnSuccess: function(response , options) {
          Ext.Msg.show({
	          msg: Dnet.translate("msg", "chpswd_success")
	         ,buttons: Ext.MessageBox.OK
	         ,scope:this
	         ,icon: Ext.MessageBox.INFO

		 });
		// this.close();
	}

	,doTask: function(btn, evnt) {

		if (this.getPasswordField().getValue() != this.getConfirmPasswordField().getValue() ) {

			Ext.Msg.show({
		          msg: Dnet.translate("msg", "chpswd_nomatch")
		         ,buttons: Ext.MessageBox.OK
		         ,scope:this
		         ,icon: Ext.MessageBox.ERROR
			 });
			return;
		}

		var p = {}; 
		p["npswd"] = Ext.util.MD5(this.getPasswordField().getValue() );
		p["opswd"] = Ext.util.MD5(this.getCurrentPasswordField().getValue() );
 
		Ext.Ajax.request({
             method:"POST"
            ,params:p
            ,failure:this.doOnFailure
			,success:this.doOnSuccess
            ,scope:this
            ,url: Dnet.sessionAPI("json").changePassword
            ,timeout:600000
        });
	}

	,clearFields: function() {
		this.items.each( function(item) { item.setValue(null); } , this);
	}
 
	,enableAction: function() {
		var valid = true;
		this.items.each( function(item) { if (!item.isValid() ) {valid=false;return false; } } , this);
		if (this.getForm().isValid() ) {
			this.getTheButton().enable();
		} else {
			this.getTheButton().disable();
		}
	}
});


Ext.define("dnet.base.ChangePasswordWindow" , {
	extend: "Ext.Window",
	initComponent: function() {
	
		var btn = Ext.create('Ext.Button', {
			text : Dnet.translate("msg", "login_btn"),
			disabled : true
		}); 
		 
		var cfg = {
			title : Dnet.translate("msg", "chpswd_btn"),
			border : true,
			width : 350,
			resizable : false,
			closeAction : "hide",
			padding : 5,
			closable : true,
			constrain : true,
			xtype : "form",
			buttonAlign : "center",
			modal : true,
			items : new dnet.base.ChangePasswordForm({theButton: btn}),
			buttons : [ btn ]
		};
		Ext.apply(this, cfg);
	
		dnet.base.ChangePasswordWindow.superclass.initComponent.call(this, arguments);
 
 	}
 
});