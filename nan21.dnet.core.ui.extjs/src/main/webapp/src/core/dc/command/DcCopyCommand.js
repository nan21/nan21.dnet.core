Ext.define("dnet.base.DcCopyCommand", {
	extend : "dnet.base.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;
		var source = dc.getRecord();
		if (!source) {
			return;
		} 
		var target = source.copy();		 
		target.data.id = null;
		Ext.data.Model.id(target);
		if (dc.dcContext) {
			dc.dcContext._applyContextData_(target);
		}
		dc.store.add(target);
		dc.setRecord(target);
		//dc.setSelectedRecords( [ dc.record ]);
	},

	checkActionState : function() {
		if (dnet.base.DcActionsStateManager.isCopyDisabled(this.dc)) {
			throw ("Copying a record is not allowed.");
		}
	}

});
