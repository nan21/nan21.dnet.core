

Ext.define("dnet.base.DcSaveCommand", {
	extend: "dnet.base.AbstractDcAsyncCommand" ,

 
	onExecute: function() {	
		var dc = this.dc; 
		if (!dc.multiEdit) {	   	 
	       if ( dc.isRecordValid() ) {
	    	 //dc.store.baseParams.params = Ext.encode(dc.params.data);
	         dc.store.sync();
		   } else {
			   Ext.Msg.show({
				   	msg : "Form contains invalid data. Fix the incorrect values then try again.",
				   	title: 'Invalid form data',					 
					icon : Ext.MessageBox.ERROR,
					buttons :Ext.MessageBox.OK
			   }); 
			   return;
		   }
	   } else {
		   //dc.store.baseParams.params = Ext.encode(dc.params.data);
		   dc.store.sync(); 
	   }		 
	}	

	,checkActionState: function() {
		if (dnet.base.DcActionsStateManager.isSaveDisabled(this.dc)) {	
			throw("Save is not allowed.");
		}
	}
});
 