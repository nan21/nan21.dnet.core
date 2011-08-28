Ext.ns("dnet.base");

dnet.base.DcNewCommand = Ext.extend(dnet.base.AbstractDcSyncCommand, {

	onExecute : function() {
		var dc = this.dc;
		var r = new dc.RecordModel(dc.emptyRecordData(dc.recordFields));

		if (dc.dcContext) {
			dc.dcContext._applyContextData_(r);
		}
		dc.store.add(r);
		dc.setRecord(r);
		dc.setSelectedRecords( [ dc.record ]);
		dc.fireEvent("afterDoNew", {dc:dc});
	},

	checkActionState : function() {
		if (dnet.base.DcActionsStateManager.isNewDisabled(this.dc)) {
			throw ("Creating new record is not allowed.");
		}
	}
});