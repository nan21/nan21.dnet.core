Ext.define("dnet.base.DcCopyCommand", {
	extend : "dnet.base.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;
		//console.log("copy: 1-store.getCount() = "+dc.store.getCount() );
		//console.log("copy: 1-count dirty  = "+dc.store.data.filterBy(function(e) { return e.dirty}).getCount()  );

		var source = dc.getRecord();
		if (!source) {
			return;
		} 
		var target = source.copy();		 
		target.data.id = null;
		target.phantom = true;
		target.dirty = true;
		Ext.data.Model.id(target);
		if (dc.dcContext) {
			dc.dcContext._applyContextData_(target);
		}
		dc.setRecord(target);
		dc.store.add(target);
		
		//console.log("copy: 2-store.getCount() = "+dc.store.getCount() );
		//console.log("copy: 2-count dirty  = "+dc.store.data.filterBy(function(e) { return e.dirty}).getCount()  );

		//dc.setSelectedRecords( [ dc.record ]);
	},

	checkActionState : function() {
		if (dnet.base.DcActionsStateManager.isCopyDisabled(this.dc)) {
			throw ("Copying a record is not allowed.");
		}
	}

});
