Ext.ns("dnet.base");

dnet.base.DcSaveCommand = Ext.extend(dnet.base.AbstractDcAsyncCommand, {
	
	onExecute: function() {	
		var dc = this.dc; 
		if (!dc.multiEdit) {	   	 
	       if ( dc.isRecordValid() ) {
	    	 dc.store.baseParams.params = Ext.encode(dc.params.data);
	         dc.store.save();
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
 