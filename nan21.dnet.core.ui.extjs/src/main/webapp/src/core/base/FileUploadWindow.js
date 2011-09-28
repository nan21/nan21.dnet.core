 
Ext.define("dnet.base.FileUploadWindow" , {
	extend:"Ext.Window",
	 initComponent: function(config) {
		var cfg = {
				title:Dnet.translate("msg", "upload_title")
					,border: true
					,width: 400
					,height:140
					,resizable: true					 
					,closable: true
									 
					,constrain:true
					,layout:"fit"
					
					,modal:true
					,items: [{
						xtype:"form"
						,padding:5	
						,labelAlign:"right"
						,labelWidth:"90"
						,frame:true
						,fileUpload: true
						,buttonAlign:"center"
						,items:[
					      {xtype:"textfield", name:"name", fieldLabel:Dnet.translate("msg", "upload_name"), width:200, selectOnFocus: true, allowBlank: true					    	  
					    	  ,listeners: {change: {scope:this, fn:this.enableAction }}   }
					     ,{xtype:"fileuploadfield", name:"file", fieldLabel:Dnet.translate("msg", "upload_file"), width:200, selectOnFocus: true, allowBlank: false					    	 
					     	,listeners: {change: {scope:this, fn:this.enableAction }}   }
					     ,{xtype:"hidden", name:"p1" }
					     ,{xtype:"hidden", name:"p2" }

					 ]
					}]
				    ,buttons:[
				        {xtype:"button", text:Dnet.translate("msg", "upload_btn"), scope:this, handler: this.doUpload }    	         
				    ] 
			};

		Ext.apply(cfg,config);
        Ext.apply(this,cfg);

		dnet.base.FileUploadWindow.superclass.initComponent.call(this);
 
 	}
    ,getButton: function() {
		return this.items.get(0).buttons[0];
	}
	,getNameField: function() {
		return this.items.get(0).items.get(0);
	}
	,getFileField: function() {
		return this.items.get(0).items.get(1);
	}
	,getP1Field: function() {
		return this.items.get(0).items.get(2);
	}
	,getP2Field: function() {
		return this.items.get(0).items.get(3);
	}
 
	,getForm: function() {
		return this.items.get(0).getForm();
	}  
	,doUpload: function(btn, evnt) {
         if(this.getForm().isValid()){
            this.getForm().submit({
                url: '/nan21.dnet.core.web/upload/deployUploadedWorkflow',
                waitMsg: 'Uploading...',
                success: function(fp, o){
            		Ext.Msg.hide();
            		alert(o.response.responseText);
            		
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
			    }
            });
        } else {
        	Ext.Msg.show('No file selected. Nothing to upload');
        }
        
	}

	,clearFields: function() {
		this.items.each( function(item) { item.setValue(null); } , this);
	}
    ,clearInvalid: function() {
		this.getNameField().clearInvalid();
		this.getFileField().clearInvalid();
	}
	 
	 
});