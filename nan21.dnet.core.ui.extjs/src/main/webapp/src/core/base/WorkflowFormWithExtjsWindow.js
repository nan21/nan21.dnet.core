
Ext.ns("dnet.base");
dnet.base.WorkflowFormWithExtjsWindow = Ext.extend(Ext.Window , {

	constructor: function(config) {
		var cfg = {			 
			 border: true
			,width: 400
			,height:400
			,resizable: true					 
			,closable: true								 
			,constrain:true
			,layout:"fit"				
			,modal:true		
			,buttonAlign:"center"
		    ,buttons:[
		        {xtype:"button", text:Dnet.translate("tlbitem", "save__lbl"), scope:this, handler: this.doSave }    	         
		    ] 
			};
		 
		Ext.apply(cfg,config);	  
		dnet.base.WorkflowFormWithExtjsWindow.superclass.constructor.call(this, cfg);

	}
	
	, initComponent: function() {
		  
		dnet.base.WorkflowFormWithHtmlWindow.superclass.initComponent.call(this);
 
 	}
    ,getButton: function() {
		return this.items.get(0).buttons[0];
	}
    ,getForm: function() {
		return this.items.get(0).getForm();
	}  
	,doSave: function(btn, evnt) {
		if(this.getForm().isValid()){
            this.getForm().submit({
                url: '/nan21.dnet.core.web/upload/deployUploadedWorkflow',
                waitMsg: 'Uploading...',
                success: function(fp, o){
            		Ext.Msg.hide();
            		Ext.Msg.alert(o.response.responseText);            		
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
        	Ext.Msg.alert('Invalid form data','Form fields may not be submitted with invalid values');
        }
        
	}
 
	 
});