

Ext.define("dnet.core.base.WfStartFormWindowExtjs", {
	extend:  "dnet.core.base.WfAbstractFormWindowExtjs" ,
 
 	
	_processDefinitionId_ : null,
	_processDefinitionKey_ : null,
	_businessKey_ : null,
	 
	initComponent: function() {		
		 
		this.items = {
			xtype:"form",
			url: Dnet.wfProcessInstanceAPI(null).start,			
			bodyPadding: 10,
			//width: 500,
			layout: 'anchor',
			fieldDefaults : {
				labelAlign : "right",
				labelWidth : 130
			},
			frame:true,
		    defaults: {
		        anchor: '100%'
		    },
			items: this._buildForm_(),
			
			buttons: [ {
			        text: 'Submit',
			        formBind: true, //only enabled once the form is valid
			        disabled: true,
			        handler: function() {
			            var form = this.up('form').getForm();
			            if (form.isValid()) {
			            	Ext.Msg.wait("Working...");
			                form.submit({
			                    success: function(form, action) {
			                       Ext.Msg.hide();
			                       Ext.Msg.alert('Success', "Process started successfully");
			                       this.up('window').close();
			                    },
			                    failure: function(form, action) {
			                    	Ext.Msg.hide();
			                        Ext.Msg.alert('Failed', action.response.responseText);
			                    },
			                    scope:this
			                });
			            }
			        }
			    },{
			        text: 'Reset',
			        handler: function() {
			            this.up('form').getForm().reset();
			        }
			    }]
		}
		this.callParent(arguments);
 	},
    
 	
 	_buildForm_:function() {
 		var fields = [];
 		
 		fields[0] = {
 			xtype:"hidden",
 			name:"processDefinitionId",
 			value:this._processDefinitionId_
 		}
 		fields[1] = {
 			xtype:"hidden",
 			name:"processDefinitionKey",
 			value:this._processDefinitionKey_
 		}
 		fields[2] = {
 			xtype:"hidden",
 			name:"businessKey",
 			value:this._businessKey_
 		}
 		this._buildFormFields_(fields);
 		return fields;
 	} 
});