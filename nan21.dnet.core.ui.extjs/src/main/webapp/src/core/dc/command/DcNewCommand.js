Ext.define("dnet.base.DcNewCommand", {
	extend : "dnet.base.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;
		var r = Ext.create(dc.recordModel, {});

		if (dc.dcContext) {
			dc.dcContext._applyContextData_(r);
		}
		dc.store.add(r);

		dc.setRecord(r);
		//dc.setSelectedRecords( [ dc.record ]);
		dc.fireEvent("afterDoNew", {
			dc : dc
		});
	},

	checkActionState : function() {
		if (dnet.base.DcActionsStateManager.isNewDisabled(this.dc)) {
			throw ("Creating new record is not allowed.");
		}
	}
});