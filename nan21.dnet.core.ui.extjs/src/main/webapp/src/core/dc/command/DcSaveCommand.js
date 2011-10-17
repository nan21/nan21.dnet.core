

Ext.define("dnet.base.DcSaveCommand", {
	extend: "dnet.base.AbstractDcAsyncCommand" ,

	errorTpl: Ext.create('Ext.XTemplate', 
			['<ul><tpl for="."><li>',
			 '<span class="field-name">{field}</span>:',
			 '<span class="error">{message}</span>',
			 '</li></tpl></ul>']),
	 
 
	beforeExecute: function() {
		var dc = this.dc;
		if (!dc.multiEdit) {
			return this.isValid(dc.getRecord());			
		}else {			 
			if ( ! this.isValid(dc.store.getUpdatedRecords()) ) {
				return false;
			}
			if ( ! this.isValid(dc.store.getAllNewRecords()) ) {
				return false;
			} 			 
			return true;
		}		
	},
	
	
	onExecute: function() {	
		this.dc.store.proxy.extraParams.params=Ext.JSON.encode(this.dc.params.data);
		this.dc.store.sync(); 		 	
	},
	
	checkActionState: function() {
		if (dnet.base.DcActionsStateManager.isSaveDisabled(this.dc)) {	
			throw("Save is not allowed.");
		}
	},
	
	isValid: function(recs) {
		if (!Ext.isArray(recs)) {
			recs = [recs];
		}
		var len = recs.length;
		var errors = null;
		for(var i=0;i<len;i++) {
			errors = recs[i].validate();
			if (!errors.isValid()) {
				Ext.Msg.show({
					   title: 'Invalid data',
					   msg: this.errorTpl.apply(errors.getRange()),
					   icon : Ext.MessageBox.ERROR,
					   buttons :Ext.MessageBox.OK
				   }); 
				return false;
			}
		}
		return true;
	}
});
 