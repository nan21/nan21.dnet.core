
Ext.ns("dnet.base");
dnet.base.WorkflowFormWithHtmlWindow = Ext.extend(Ext.Window , {

	constructor: function(config) {
		var cfg = {			 
			 border: true
			,width: 500
			,height:500
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
		var resolved = false;
		if (config._wfConfig_.type == "startform") {
			var submitUrl=Dnet.wfProcessInstanceAPI().start;
			
			var startHtml = "<form id='dnet-workflow-form' action='"+submitUrl+"'>" +
					"<input type='hidden' name='processDefinitionId' value='"+config._wfConfig_.processDefinitionId+"'>" +
					"<input type='hidden' name='processDefinitionKey' value=''>" +
					"<input type='hidden' name='businessKey' value=''>";
			var endHtml = "</form>";
			resolved = true;
		} 
		if (config._wfConfig_.type == "taskform") {
			var submitUrl=Dnet.wfTaskAPI(config._wfConfig_.taskId).complete;
			
			var startHtml = "<form id='dnet-workflow-form' action='"+submitUrl+"'>";					 
			var endHtml = "</form>";
			resolved = true;
		} 
		
		if(!resolved) {
			throw("Invalid value for _wfConfig_.type in WorkflowFormWithHtmlWindow.");
		}
		config.html = startHtml + config.html + endHtml;
		Ext.apply(cfg,config);
	   
	
		dnet.base.WorkflowFormWithHtmlWindow.superclass.constructor.call(this, cfg);

	}
	
	, initComponent: function() {
		  
		dnet.base.WorkflowFormWithHtmlWindow.superclass.initComponent.call(this);
 
 	}
    ,getButton: function() {
		return this.items.get(0).buttons[0];
	}
	  
	,doSave: function(btn, evnt) {
        var frm = document.getElementById("dnet-workflow-form");
        var p = {},elements = frm.elements,len = elements.length;       
        for(var i=0;i<len; i++) {
        	p[elements[i].name] = elements[i].value;        	
        }
        Ext.Ajax.request({
			url: frm.action, method:"POST", params: p
			,success :this.onSaveSuccess
			,failure: this.onSaveFailure	
			,scope: this			 
		});
	}
	,onSaveSuccess: function(response,options) {
		this.close();
	}
	,onSaveFailure: function(response,options) {
		Ext.MessageBox.hide();
		var msg, withDetails=false;
		if (response.responseText) {
			if (response.responseText.length > 2000) {
				msg = response.responseText.substr(0,2000);
				withDetails = true;
			} else {
				msg = response.responseText ;
			}
		} else {
			msg = "No response received from server.";
		}
		var alertCfg = { msg: msg, scope:this, icon: Ext.MessageBox.ERROR, buttons: {ok:'OK'} }  
		if (withDetails) {
			alertCfg.buttons['cancel'] = 'Details';
			alertCfg['detailedMessage'] = response.responseText;
		}		  
      	Ext.Msg.show(alertCfg);
	} 
});