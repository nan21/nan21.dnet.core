
Ext.ns("dnet.base");
dnet.base.ChangePasswordWindow = Ext.extend(Ext.Window , {

	 initComponent: function(config) {
		var cfg = {
				title:Dnet.translate("msg", "chpswd_title")
					,border: true
					,width: 350
					,resizable: false

					,padding:20
					,closable:true
					,constrain:true
					,layout:"form"
					,labelAlign:"right"
					,buttonAlign:"center"
					,modal:true
					,items: [
					
							{xtype:"textfield", name:"pswd1", fieldLabel:Dnet.translate("msg", "chpswd_pswd1"), width:150, selectOnFocus: true, allowBlank: false
						    	,autoCreate: {tag: "input", type: "password", autocomplete: "off", size: "20" }
						     	,listeners: {change: {scope:this, fn:this.enableAction }}   }
					     	
					     	,{xtype:"textfield", name:"pswd2", fieldLabel:Dnet.translate("msg", "chpswd_pswd2"), width:150, selectOnFocus: true, allowBlank: false
						    	,autoCreate: {tag: "input", type: "password", autocomplete: "off", size: "20" }
						     	,listeners: {change: {scope:this, fn:this.enableAction }}   }
					     	

					 ]
				    ,buttons:[
				        {xtype:"button", text:Dnet.translate("msg", "chpswd_btn"), disabled:true
				        	, scope:this, handler: this.doTask }
				    ] 
			};

		Ext.apply(cfg,config);
        Ext.apply(this,cfg);

		dnet.base.ChangePasswordWindow.superclass.initComponent.call(this);

 	}

	,getPasswordField: function() {
		return this.items.get(0);
	}
	,getConfirmPasswordField: function() {
		return this.items.get(1);
	}

	,doOnFailure: function(response , options) {
        // var r = Ext.util.JSON.decode( response.responseText );
		 Ext.Msg.show({
		          msg: response.responseText
		         ,buttons: {ok:'OK'}
		         ,scope:this
		         ,icon: Ext.MessageBox.ERROR
			 });

		 (response.responseText);
	}
	,doOnSuccess: function(response , options) {
          Ext.Msg.show({

		          msg: Dnet.translate("msg", "chpswd_success")
		         ,buttons: {ok:'OK'}
		         ,scope:this
		         ,icon: Ext.MessageBox.INFO

			 });
			 this.close();
	}

	,doTask: function(btn, evnt) {

		if (this.getPasswordField().getValue() != this.getConfirmPasswordField().getValue() ) {

			Ext.Msg.show({
		          msg: Dnet.translate("msg", "chpswd_nomatch")
		         ,buttons: {ok:'OK'}
		         ,scope:this
		         ,icon: Ext.MessageBox.ERROR
			 });
			return;
		}

		var p = {};

	//	p["user"] = this.getUserField().getValue();
		p["pswd"] = Ext.util.MD5(this.getPasswordField().getValue() );
	//	p["client"] = this.getClientField().getValue();
	//	p["lang"] = this.getLanguageField().getValue();

		Ext.Ajax.request({
             method:"POST"
            ,params:p
            //,async:false
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
    ,clearInvalid: function() {
		//this.getUserField().clearInvalid();
		//this.getClientField().clearInvalid();
	}


	,enableAction: function() {
		var valid = true;
		this.items.each( function(item) { if (!item.isValid() ) {valid=false;return false; } } , this);
		if (valid) {
			this.buttons[0].enable();
		} else {
			this.buttons[0].disable();
		}
	}
});