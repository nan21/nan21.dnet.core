Ext.define("dnet.core.dc.command.DcNewCommand", {
	extend : "dnet.core.dc.command.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;
 
		var r = dc.newRecordInstance();
		r.dirty = true;
		if (dc.dcContext) {
			dc.dcContext._applyContextData_(r);
		}
		dc.setRecord(r);
		dc.store.add(r);
 
		dc.fireEvent("afterDoNew", {
			dc : dc
		});
	},

	checkActionState : function() {
		if (dnet.core.dc.DcActionsStateManager.isNewDisabled(this.dc)) {
			throw ("Creating new record is not allowed.");
		}
	}
});