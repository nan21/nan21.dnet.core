Ext.define("dnet.base.DcCopyCommand", {
	extend : "dnet.base.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;
		var r = new dc.RecordModel(dc.emptyRecordData(dc.recordFields));
		Ext.apply(r.data, dc.record.data);
		r.data.id = null;
		if (dc.dcContext) {
			dc.dcContext._applyContextData_(r);
		}
		dc.store.add(r);
		dc.setRecord(r);
		dc.setSelectedRecords( [ dc.record ]);
	},

	checkActionState : function() {
		if (dnet.base.DcActionsStateManager.isCopyDisabled(this.dc)) {
			throw ("Copying a record is not allowed.");
		}
	}

});
