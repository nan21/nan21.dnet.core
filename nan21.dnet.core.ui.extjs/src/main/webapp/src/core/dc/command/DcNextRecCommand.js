Ext.ns("dnet.base");

dnet.base.DcNextRecCommand = Ext.extend(dnet.base.AbstractDcSyncCommand, {

	onExecute : function() {
		var dc = this.dc;
		if (dc.selectedRecords.length <= 1) {
			var crtIdx = dc.store.indexOf(dc.record);
			if (++crtIdx >= dc.store.getCount()) {
				throw (dnet.base.DcExceptions.NAVIGATE_AFTER_LAST);
			} else {
				dc.setRecord(dc.store.getAt(crtIdx));
			}
		} else {
			var crtIdx = dc.selectedRecords.indexOf(dc.record);
			if (++crtIdx >= dc.selectedRecords.length) {
				throw (dnet.base.DcExceptions.NAVIGATE_AFTER_LAST);
			} else {
				dc.setRecord(dc.selectedRecords[crtIdx]);
			}
		}
	}
});
