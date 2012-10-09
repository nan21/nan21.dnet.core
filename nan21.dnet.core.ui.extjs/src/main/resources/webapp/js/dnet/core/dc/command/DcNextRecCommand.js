Ext.define("dnet.core.dc.command.DcNextRecCommand", {
	extend : "dnet.core.dc.command.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;
		if (dc.selectedRecords.length <= 1) {
			var crtIdx = dc.store.indexOf(dc.record);
			if (++crtIdx >= dc.store.getCount()) {
				throw (dnet.core.dc.DcExceptions.NAVIGATE_AFTER_LAST);
			} else {
			 	dc.setRecord(dc.store.getAt(crtIdx), true);
			}
		} else {
			var crtIdx = dc.selectedRecords.indexOf(dc.record);
			if (++crtIdx >= dc.selectedRecords.length) {
				throw (dnet.core.dc.DcExceptions.NAVIGATE_AFTER_LAST);
			} else {			 
				dc.setRecord(dc.selectedRecords[crtIdx]);
			}
		}
	}
});
