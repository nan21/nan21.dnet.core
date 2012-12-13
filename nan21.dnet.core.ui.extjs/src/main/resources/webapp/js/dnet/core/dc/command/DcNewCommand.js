Ext.define("dnet.core.dc.command.DcNewCommand", {
	extend : "dnet.core.dc.command.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;

		if (!dc.multiEdit && dc.isDirty()) {
			throw (dnet.core.dc.DcExceptions.DIRTY_DATA_FOUND);
		}

		var r = dc.newRecordInstance();
		if (dc.dcContext) {
			dc.dcContext._applyContextData_(r);
		}		
		dc.setRecord(r, true);
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