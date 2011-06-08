
Ext.ns("dnet.base");
dnet.base.LoginWindow = Ext.extend(Ext.Window , {

	 initComponent: function(config) {
		var cfg = {
				title:Dnet.translate("msg", "login_title")
					,border: true
					,width: 350
					,resizable: false
					,closeAction:"hide"
					,padding:20
					,closable:false
					,constrain:true
					,layout:"form"
					,labelAlign:"right"
					,buttonAlign:"center"
					,modal:true
					,items: [
					      {xtype:"textfield", name:"usr", fieldLabel:Dnet.translate("msg", "login_user"), width:150, selectOnFocus: true, allowBlank: false
					    	  ,value: getApplication().getSession().getUser().code
					    	  ,listeners: {change: {scope:this, fn:this.enableAction }}   }
					     ,{xtype:"textfield", name:"pswd", fieldLabel:Dnet.translate("msg", "login_pswd"), width:150, selectOnFocus: true, allowBlank: false
					    	,autoCreate: {tag: "input", type: "password", autocomplete: "off", size: "20" } 
					     	,listeners: {change: {scope:this, fn:this.enableAction }}   }
					     ,{xtype:"textfield", name:"client", fieldLabel:Dnet.translate("msg", "login_client"), width:150, selectOnFocus: true, allowBlank: false
					    	 ,value: getApplication().getSession().getClient().code
					    	 ,listeners: {change: {scope:this, fn:this.enableAction }}   }
					     ,{xtype:"combo", name:"lang", fieldLabel:Dnet.translate("msg", "login_lang"), width:150, selectOnFocus: true, forceSelection: true, allowBlank: false, triggerAction:"all" , store: ["English","Romana"] , value:"English"
					    	 ,listeners: {change: {scope:this, fn:this.enableAction }}   }

					 ]
				    ,buttons:[
				        {xtype:"button", text:Dnet.translate("msg", "login_btn"), disabled:true
				        	, scope:this, handler: this.doLogin }    	         
				    ] 
			};

		Ext.apply(cfg,config);
        Ext.apply(this,cfg);

		dnet.base.LoginWindow.superclass.initComponent.call(this);
		var u = getApplication().getSession().getUser();
		//if ( u && u.userName ) {
		//	this.items.get("usr").setValue(u.userName);
		//}

 	}
    ,getLoginButton: function() {
		return this.buttons[0];
	}
	,getUserField: function() {
		return this.items.get(0);
	}
	,getPasswordField: function() {
		return this.items.get(1);
	}
	,getClientField: function() {
		return this.items.get(2);
	}
	,getLanguageField: function() {
		return this.items.get(3);
	}

	,doLoginFailure: function(response , options) { 
        // var r = Ext.util.JSON.decode( response.responseText );
		 Ext.Msg.show({
		 	  title: 'Authentication error'
	         ,msg: response.responseText
	         ,buttons: {ok:'OK'}
	         ,scope:this
	         
	         ,icon: Ext.MessageBox.ERROR

			 });

		 this.getLoginButton().enable();
	}
	,doLoginSuccess: function(response , options) {
          var r = Ext.util.JSON.decode( response.responseText );
	      var u = getApplication().getSession().getUser();
	      var c = getApplication().getSession().getClient();
          u.name = r.data.name;
          c.id = r.data.clientId;
		  getApplication().onLoginSuccess();
	}

	,doLogin: function(btn, evnt) {
        var s = getApplication().getSession();
	    var u = s.getUser();

        u.code = this.getUserField().getValue();
        s.client.code = this.getClientField().getValue();
		var p = {};
		
		p["user"] = this.getUserField().getValue();
		p["pswd"] = Ext.util.MD5(this.getPasswordField().getValue() );
		p["client"] = this.getClientField().getValue();
		p["lang"] = this.getLanguageField().getValue();

		Ext.Ajax.request({
             method:"POST"
            ,params:p
            //,async:false
            ,failure:this.doLoginFailure
			,success:this.doLoginSuccess
            ,scope:this
            ,url: Dnet.sessionAPI("json").login
            ,timeout:600000

        });
	   this.getLoginButton().disable();
	}

	,clearFields: function() {
		this.items.each( function(item) { item.setValue(null); } , this);
	}
    ,clearInvalid: function() {
		this.getUserField().clearInvalid();
		this.getClientField().clearInvalid();
	}
	
	,applyState_Logout: function() {
		this.getUserField().enable();
		
		this.getPasswordField().enable();
		this.getPasswordField().setValue(null);
		this.getPasswordField().clearInvalid();
		
		this.getClientField().enable();
		this.getClientField().setValue(null);
		this.getClientField().clearInvalid();
		
		this.getLanguageField().enable();
		this.buttons[0].disable();
	}
	
	,applyState_LockSession: function() {
		this.getUserField().disable();
		this.getPasswordField().setValue(null);
		this.getPasswordField().clearInvalid();
		this.getClientField().disable();
		this.getLanguageField().disable();
		this.buttons[0].disable();
	}
	
	,setUserName: function(v) {
		this.items.get("usr").setValue(v);
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