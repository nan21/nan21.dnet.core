
/**
 * Creates a form with an upload field and a set of extra fields to be submitted to
 * the server.
 */
Ext.define("dnet.core.base.FileUploadWindow2", {
	extend:"Ext.Window",
	
	_description_ : null,
	
	_uploadUrl_: null,
	
	/**
	 * Extra fields configuration object as valid Extjs.form.field definition
	 * 
	 * Example: { name1 : { xtype:"hidden", value: "aa", }, name2:{
	 * xtype:"textfield" , value: "x", fieldLabel :"Enter new name for file" }
	 * ..... }
	 * 
	 * The field names are constructed as "_p_"+nameX. A generic upload servlet
	 * on server-side will collect all these params in a java.util.Map and pass
	 * them to the delegate processor. Also will try to inject into the delegate
	 * the parameters if appropriate setters exist.
	 */
	_fields_ : null,
	
	_succesCallbackFn_:null,
	_succesCallbackScope_:null,
	
	initComponent: function(config) {
		var cfg = {
			title:Dnet.translate("msg", "upload_title"),
			border: true,
			width: 400,
			//height:140,
			resizable: true,					 
			closable: true,
			closeAction: "hide",				 
			constrain:true,
			modal:true,
			
			layout:"fit",
			
			
			items: [{
				xtype:"form",
				padding:5,
				frame:true,
				fileUpload: true,
				buttonAlign:"center",
				fieldDefaults:{
			  		labelAlign:"right",
			  		labelWidth:90  
			  	},			  	 
				items: this._buildFieldsConfig_()
			}],
			
			buttons:[
			    {xtype:"button", text:Dnet.translate("msg", "upload_btn"), scope:this, handler: this.doUpload }    	         
			] 
		};

		Ext.apply(cfg,config);
        Ext.apply(this,cfg);

        this.callParent(arguments);
 	},
    
 	_buildFieldsConfig_ : function() {
 		var _items = [];
 		if ( this._description_	!= null) {
 			_items[_items.length] = {xtype:"label" , text: this._description_  };
 		}
 		_items[_items.length] = {xtype:"fileuploadfield", name:"file", 
			fieldLabel:Dnet.translate("msg", "upload_file"), anchor:"-10" , 
			selectOnFocus: true, allowBlank: false };
 		for(var k in this._fields_ ) {
 		    if(this._fields_.hasOwnProperty(k)) {
 		    	var v = this._fields_[k];
 		    	v["name"] = "_p_" + k;
 		    	_items[_items.length] = v;
 		    }
 		}
 		return _items;
 	},
 	
 	
    getButton: function() {
		return this.items.get(0).buttons[0];
	},
 
	getFileField: function() {
		return this.items.get(0).items.get(1);
	},
 
	getForm: function() {
		return this.items.get(0).getForm();
	},
	
	
	doUpload: function(btn, evnt) {
         if(this.getForm().isValid()){
            this.getForm().submit({
                url: this._uploadUrl_,
                waitMsg: 'Uploading...',
                scope: this,
                success: function(form, action){
            		Ext.Msg.hide();
            		this.close();
            		if (this._succesCallbackFn_ != null ) {
            			this._succesCallbackFn_.call(this._succesCallbackScope_ || this);
            		}             		
                }
                ,failure: function(form, action) {
                	try {
                		Ext.Msg.hide();
                	} catch (e) {
                		
                	}
			        switch (action.failureType) {
			            case Ext.form.Action.CLIENT_INVALID:
			                Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
			                break;
			            case Ext.form.Action.CONNECT_FAILURE:
			                Ext.Msg.alert('Failure', action.response.responseText);
			                break;
			            case Ext.form.Action.SERVER_INVALID:
			               Ext.Msg.alert('Failure', action.result.msg);
			       }
			       this.close();
			    }
            });
        } else {
        	Ext.Msg.alert("",'Form contains invalid data. Please fix the errors then try again.');
        }        
	} 
});



	/**
	 * Deprecated
	 */
Ext.define("dnet.core.base.FileUploadWindow", {
	extend:"Ext.Window",
	
	_nameFieldValue_: null, 
	_uploadUrl_: null,
	

	_p1Value_: null,
	_p2Value_: null,
	
	_succesCallbackFn_:null,
	_succesCallbackScope_:null,
	
	initComponent: function(config) {
		var cfg = {
			title:Dnet.translate("msg", "upload_title"),
			border: true,
			width: 400,
			height:140,
			resizable: true,					 
			closable: true,
							 
			constrain:true,
			layout:"fit",
			
			modal:true,
			items: [{
				xtype:"form",
				padding:5	,
				fieldDefaults:{
			  		labelAlign:"right",
			  		labelWidth:90  
			  	},
		 
				frame:true,
				fileUpload: true,
				buttonAlign:"center",
				items:[
					{xtype:"textfield", value:this._nameFieldValue_, name:"name", 
						fieldLabel:Dnet.translate("msg", "upload_name"), anchor:"-10" , 
						selectOnFocus: true, allowBlank: true},
					{xtype:"fileuploadfield", name:"file", 
						fieldLabel:Dnet.translate("msg", "upload_file"), anchor:"-10" , 
						selectOnFocus: true, allowBlank: false },
					{xtype:"hidden", name:"p1", value:this._p1Value_},
					{xtype:"hidden", name:"p2", value:this._p2Value_}
				]
			}],
			buttons:[
			    {xtype:"button", text:Dnet.translate("msg", "upload_btn"), scope:this, handler: this.doUpload }    	         
			] 
		};

		Ext.apply(cfg,config);
        Ext.apply(this,cfg);

        this.callParent(arguments);
 	},
    
    getButton: function() {
		return this.items.get(0).buttons[0];
	},
 
	getNameField: function() {
		return this.items.get(0).items.get(0);
	},
 	
	getFileField: function() {
		return this.items.get(0).items.get(1);
	},
	
	getP1Field: function() {
		return this.items.get(0).items.get(2);
	},
	
	
	
	getP2Field: function() {
		return this.items.get(0).items.get(3);
	},
	
	
	getForm: function() {
		return this.items.get(0).getForm();
	},
	
	
	doUpload: function(btn, evnt) {
         if(this.getForm().isValid()){
            this.getForm().submit({
                url: this._uploadUrl_,
                waitMsg: 'Uploading...',
                scope: this,
                success: function(form, action){
            		Ext.Msg.hide();
            		this.close();
            		if (this._succesCallbackFn_ != null ) {
            			this._succesCallbackFn_.call(this._succesCallbackScope_ || this);
            		}             		
                }
                ,failure: function(form, action) {
                	Ext.Msg.hide();
			        switch (action.failureType) {
			            case Ext.form.Action.CLIENT_INVALID:
			                Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
			                break;
			            case Ext.form.Action.CONNECT_FAILURE:
			                Ext.Msg.alert('Failure', action.response.responseText);
			                break;
			            case Ext.form.Action.SERVER_INVALID:
			               Ext.Msg.alert('Failure', action.result.msg);
			       }
			       this.close();
			    }
            });
        } else {
        	Ext.Msg.alert("",'No file selected. Nothing to upload');
        }        
	},

	clearFields: function() {
		this.items.each( function(item) { item.setValue(null); } , this);
	},
    
	
	clearInvalid: function() {
		this.getNameField().clearInvalid();
		this.getFileField().clearInvalid();
	}
	 
	 
});