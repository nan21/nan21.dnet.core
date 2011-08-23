Ext.ns("dnet.base");
dnet.base.WorkflowFormFactory = Ext.apply({}, {
	
	createStartForm: function(processDefinitionId) {
		 
		var succesFn = function(response , options) {			
			try{				
				// try to decode to see if it is a valid extjs formpanel definition 
				//var theForm = null;	
				//jsonForm = Ext.
				//return new dnet.base.WorkflowFormWithExtjsWindow({ items: theForm });
			}catch(e) {
				
			}
			var w= new dnet.base.WorkflowFormWithHtmlWindow({ 
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
			try{				
				// try to decode to see if it is a valid extjs formpanel definition 
				//var theForm = null;	
				//jsonForm = Ext.
				//return new dnet.base.WorkflowFormWithExtjsWindow({ items: theForm });
			}catch(e) {
				
			}
			var w= new dnet.base.WorkflowFormWithHtmlWindow({ 
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
});

/*
 * 
 * var successFn =  function(dc, response, serviceName, specs) {
			var theForm = {
				xtype:"form"
				,padding:5	
				,labelAlign:"right"
				,labelWidth:"90"
				,frame:true
				,fileUpload: true
				,buttonAlign:"center"
				,items:[
				      {xtype:"textfield", name:"employeeName", fieldLabel:"Employee name", width:200, selectOnFocus: true, allowBlank: false}
				     ,{xtype:"numberfield", name:"numberOfDays", fieldLabel:"Number of days", width:200, selectOnFocus: true, allowBlank: false}
				     ,{xtype:"datefield", name:"startDate", fieldLabel:"First day of vacation", width:200, selectOnFocus: true, allowBlank: false}
			     ]
				 	
			}
			
			//var w = new dnet.base.WorkflowFormWithHtmlWindow({html:response.responseText});
			var w = new dnet.base.WorkflowFormWithExtjsWindow({ items: theForm });
			 
			w.show();
			 var theForm = {
					xtype:"form"
						,padding:5	
						,labelAlign:"right"
						,labelWidth:"90"
						,frame:true
						,fileUpload: true
						,buttonAlign:"center"
						,items:[
					      {xtype:"textfield", name:"employeeName", fieldLabel:"Employee name", width:200, selectOnFocus: true, allowBlank: false}
					     ,{xtype:"numberfield", name:"numberOfDays", fieldLabel:"Number of days", width:200, selectOnFocus: true, allowBlank: false}
					     ,{xtype:"datefield", name:"startDate", fieldLabel:"First day of vacation", width:200, selectOnFocus: true, allowBlank: false}
					 ]
				 	
			}
			 
			var ww= new Ext.Window(
					{
						title:"Start process instance"
						,width:500
						,height:500
						,layout:'fit'
						,items:[theForm]
				        ,buttons:[
					        {xtype:"button", text:"Save", handler: function() { alert(1);} }    	         
					    ]  
					}
					); 
			ww.show(); 
			var x=1;
		} 
		var s={modal:true, callbacks:{successFn: successFn, successScope:this, silentSuccess:true} , stream:true };
		try{ 
			this._getDc_("dcProcess").doService("getStartForm", s); 
		}catch(e){
			dnet.base.DcExceptions.showMessage(e);
		}
		
		
 */ 