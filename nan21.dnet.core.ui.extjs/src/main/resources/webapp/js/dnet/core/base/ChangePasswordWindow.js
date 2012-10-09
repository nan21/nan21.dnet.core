

Ext.define("dnet.core.base.ChangePasswordForm" , {
	extend: "Ext.form.Panel",
	/**
	 * Action button rendered in the window, 
	 * given as a reference to be managed from the form.
	 * @type 
	 */
	actionButton : null,
	initComponent: function() {
	
		this.actionButton = this.initialConfig.actionButton;
		this.actionButton.setHandler(this.doTask, this);
		
		var cfg = {
			frame : true,
			bodyPadding: 10,
			fieldDefaults : {
				labelAlign : 'right',
				labelWidth : 100,
				msgTarget : 'side'
			},
			defaults : {
				anchor : '-20',
				selectOnFocus : true,
				allowBlank : false
			},
			items : this._buildItems_()
		};
		
 
        Ext.apply(this,cfg);
		 
        this.callParent(arguments);
 	},

 	/**
	 * Builder method which constructs the form elements.
	 * @return {Array}
	 */
	_buildItems_ : function() {
 		return [				
			{xtype:"textfield", itemId:"opswd", fieldLabel:"Password",   selectOnFocus: true, allowBlank: false, inputType: "password"
			 	,listeners: {change: {scope:this, fn:this.enableAction }}   }

			,{xtype:"textfield", itemId:"pswd1", fieldLabel:Dnet.translate("msg", "chpswd_pswd1"), selectOnFocus: true, allowBlank: false
		    	,inputType: "password"
		     	,listeners: {change: {scope:this, fn:this.enableAction }}   }
	     	
	     	,{xtype:"textfield", itemId:"pswd2", fieldLabel:Dnet.translate("msg", "chpswd_pswd2"), selectOnFocus: true, allowBlank: false
		    	,inputType: "password"
		     	,listeners: {change: {scope:this, fn:this.enableAction }}   }
		 ]; 		
 	},
	
 	getActionButton: function() {
 		return this.actionButton;
 	},

 	/**
	 * Getter for the current password field.
	 * @return {Ext.form.field.Text} The component (if found)
	 */
 	getCurrentPasswordField: function() {		 
		return this.getComponent("opswd");
	},
	
	/**
	 * Getter for the new password field.
	 * @return {Ext.form.field.Text} The component (if found)
	 */
	getPasswordField: function() {
		return this.getComponent("pswd1");
	},
	
	/**
	 * Getter for the confirm new password field.
	 * @return {Ext.form.field.Text} The component (if found)
	 */
	getConfirmPasswordField: function() {
		return this.getComponent("pswd2");
	},

	/**
	 * Callback invoked on unsuccessful password change attempt.
	 * @param {} response
	 * @param {} options
	 */
	onActionFailure: function(response, options) {         
		 Ext.Msg.show({
	          msg: response.responseText
	         ,buttons: Ext.MessageBox.OK
	         ,scope:this
	         ,icon: Ext.MessageBox.ERROR
		 });

		 (response.responseText);
	},
	
	/**
	 * Callback invoked on successful password change.
	 * @param {} response
	 * @param {} options
	 */
	onActionSuccess: function(response , options) {
    	Ext.Msg.show({
	          msg: Dnet.translate("msg", "chpswd_success")	          
	         ,buttons: Ext.MessageBox.OK
	         ,scope:this
	         ,icon: Ext.MessageBox.INFO
		 });
		  
	},

	/**
	 * Execute change password action. The action button click handler.
	 * @param {} btn
	 * @param {} evnt
	 */
	doTask: function(btn, evnt) {

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
            ,failure:this.onActionFailure
			,success:this.onActionSuccess
            ,scope:this
            ,url: Dnet.sessionAPI("json").changePassword
            ,timeout:600000
        });
	},
	
	/**
	 * Clear the form fields.
	 */
	clearFields: function() {
		this.items.each( function(item) { item.setValue(null); } , this);
	},
	
 	/**
	 * Enable disable action button.
	 */
	enableAction: function() {
		var valid = true;
		this.items.each( function(item) { if (!item.isValid() ) {valid=false;return false; } } , this);
		if (this.getForm().isValid() ) {
			this.getActionButton().enable();
		} else {
			this.getActionButton().disable();
		}
	}
});


Ext.define("dnet.core.base.ChangePasswordWindow" , {
	extend: "Ext.Window",
	initComponent: function() {
	
		var btn = Ext.create('Ext.Button', {
			text : Dnet.translate("tlbitem", "save__lbl"),
			disabled : true
		}); 
		 
		var cfg = {
			title : Dnet.translate("msg", "chpswd_btn"),
			border : true,
			width : 350,
			resizable : false,
			closeAction : "hide",			 
			closable : true,
			constrain : true,
			layout:"fit",
			xtype : "container",
			buttonAlign : "center",
			modal : true,
			items : new dnet.core.base.ChangePasswordForm({actionButton: btn}),
			buttons : [ btn ]
		};
		Ext.apply(this, cfg);
	
		this.callParent(arguments);
 
 	}
 
});