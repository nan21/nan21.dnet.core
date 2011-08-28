Ext.ns("dnet.base");

dnet.base.DcReloadRecCommand = Ext.extend(dnet.base.AbstractDcAsyncCommand, {

	onExecute : function(dc) {
		var dc = this.dc;
		dc.store.proxy.doRequest("read", null, {
			data : Ext.encode( {
				id : dc.record.get("id")
			})
		}, dc.store.reader, function(response, options, success) {
			if (success) {
				dc.record.beginEdit();
				for ( var p in dc.record.data) {
					dc.record.set(p, response.records[0].data[p]);
				}
				dc.record.endEdit();
				dc.record.commit();
			}
		}, dc);
	},

	checkActionState : function() {
		if (dnet.base.DcActionsStateManager.isReloadRecDisabled(this.dc)) {
			throw ("Reload record is not allowed.");
		}
	}

});
