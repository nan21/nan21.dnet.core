
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
        document.getElementById("dnet-workflow-form").submit();
        
	}
 
	 
});