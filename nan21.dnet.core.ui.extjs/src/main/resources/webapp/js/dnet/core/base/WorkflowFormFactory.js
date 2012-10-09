
dnet.core.base.WorkflowFormFactory =  {
	
	createStartForm: function(processDefinitionId) {
		 
		var succesFn = function(response , options) {			
			 
			var w= new dnet.core.base.WorkflowFormWithHtmlWindow({ 
					html: response.responseText
					,_wfConfig_:{
						type: "startform"
						,processDefinitionId:processDefinitionId
					} 
				});
			w.show();			 
		};		 
		
		Ext.Ajax.request({
			url: Dnet.wfProcessDefinitionAPI(processDefinitionId).form
			,method:"GET"
			,success :succesFn
			,failure: function() {alert('error');}	
			,scope: this
			//,options: { action: "doService", serviceName: serviceName, specs: s }
		});
	 
	}

	,createTaskForm: function(taskId) {
		 
		var succesFn = function(response , options) {			
			 
			var w= new dnet.core.base.WorkflowFormWithHtmlWindow({ 
					html: response.responseText
					,_wfConfig_:{
						type: "taskform"
						,taskId:taskId
					} 
				});
			w.show();			 
		};		 
		
		Ext.Ajax.request({
			url: Dnet.wfTaskAPI(taskId).form
			,method:"GET"
			,success :succesFn
			,failure: function() {alert('error');}	
			,scope: this
			//,options: { action: "doService", serviceName: serviceName, specs: s }
		});	 
	}	 
};
 