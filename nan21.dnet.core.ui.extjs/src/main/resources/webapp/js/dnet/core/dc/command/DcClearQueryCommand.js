Ext.define("dnet.core.dc.command.DcClearQueryCommand", {
	extend : "dnet.core.dc.command.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;
		if (dnet.core.dc.DcActionsStateManager.isQueryDisabled(dc)) {
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