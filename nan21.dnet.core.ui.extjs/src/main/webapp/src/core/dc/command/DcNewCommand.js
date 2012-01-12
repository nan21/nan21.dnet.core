Ext.define("dnet.base.DcNewCommand", {
	extend : "dnet.base.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;
		//console.log("new: 1-store.getCount() = "+dc.store.getCount() );
		//console.log("new: 1-count dirty  = "+dc.store.data.filterBy(function(e) { return e.dirty}).getCount()  );

		var r = dc.newRecordInstance();
		r.dirty = true;
		if (dc.dcContext) {
			dc.dcContext._applyContextData_(r);
		}
		dc.setRecord(r);
		dc.store.add(r);
 
		//console.log("new: 2-store.getCount() = "+dc.store.getCount() );
		//console.log("new: 2-count dirty  = "+dc.store.data.filterBy(function(e) { return e.dirty}).getCount()  );
		
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