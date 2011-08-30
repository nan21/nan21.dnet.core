Ext.ns("dnet.base");

dnet.base.DcSaveCommand = Ext.extend(dnet.base.AbstractDcAsyncCommand, {
	
	onExecute: function() {	
		var dc = this.dc; 
		if (!dc.multiEdit) {	   	 
	       if ( dc.isRecordValid() ) {
	    	 dc.store.baseParams.params = Ext.encode(dc.params.data);
	         dc.store.save();
		   } else {
			   Ext.Msg.show({
				   	msg : "Form contains invalid data. Please fix the incorrect values then try again.",
				   	title: 'Invalid form data',					 
					icon : Ext.MessageBox.ERROR,
					buttons : {
						ok : 'OK'
					}
			   }); 
			   return;
		   }
	   } else {
		   dc.store.baseParams.params = Ext.encode(dc.params.data);
		   dc.store.save(); 
	   }		 
	}	

	,checkActionState: function() {
		if (dnet.base.DcActionsStateManager.isSaveDisabled(this.dc)) {	
			throw("Save is not allowed.");
		}
	}
});
 