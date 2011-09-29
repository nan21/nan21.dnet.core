Ext.define("dnet.base.DcClearQueryCommand", {
	extend : "dnet.base.AbstractDcSyncCommand",

	execute : function(dc) {
		if (dnet.base.DcActionsStateManager.isQueryDisabled(dc)) {
			throw ("Query is not allowed.");
		}

		if (this.beforeExecute(dc) === false) {
			return false;
		}

		if (this.needsConfirm(dc)) {
			this.confirmExecute(null, dc);
			return;
		}

		for ( var p in dc.filter.data) {
			dc.filter.set(p, null);
		}
		if (dc.dcContext) {
			dc.dcContext._updateChildFilter_();
		}
	}
});