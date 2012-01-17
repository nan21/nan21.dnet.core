
Ext.define("dnet.core.dc.command.DcPrevRecCommand", {
	extend : "dnet.core.dc.command.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;
		if (dc.selectedRecords.length <= 1) {
			var crtIdx = dc.store.indexOf(dc.record);
			if (--crtIdx < 0) {
				throw (dnet.dc.DcExceptions.NAVIGATE_BEFORE_FIRST);
			} else {
				dc.setRecord(dc.store.getAt(crtIdx));
			}
		} else {
			var crtIdx = dc.selectedRecords.indexOf(dc.record);
			if (--crtIdx < 0) {
				throw (dnet.dc.DcExceptions.NAVIGATE_BEFORE_FIRST);
			} else {
				dc.setRecord(dc.selectedRecords[crtIdx]);
			}
		}
	}
});
