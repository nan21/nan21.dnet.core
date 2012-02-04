Ext.define("dnet.core.dc.command.DcCancelCommand", {
	extend : "dnet.core.dc.command.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;
		//console.log("cancel: 1-store.getCount() = "+dc.store.getCount() );
		//console.log("cancel: 1-count dirty  = "+dc.store.data.filterBy(function(e) { return e.dirty}).getCount()  );
		try {
			if (dc.store.getCount() == 0) {
				this.discardChanges();
			} else {
				this.discardChildrenChanges();
				this.discardChanges();
			}
		} catch(e) {
			// 
			alert(e);
		}
		//console.log("cancel: 2-store.getCount() = "+dc.store.getCount() );
		//console.log("cancel: 2-count dirty  = "+dc.store.data.filterBy(function(e) { return e.dirty}).getCount()  );
		//dc.updateActionsState();
	},

	discardChanges : function() {

		var dc = this.dc;
		var s = dc.store;

		if (dc.multiEdit) {
			s.rejectChanges();
		} else {
//			if (dc.record) {
//				dc.record.reject();
//			}
			
			if (dc.record.phantom) {
				//dc.store.remove(dc.record);
				/* workaround to avoid the dirty check in AbstractDc */
				var cr = dc.record;
				cr.phantom = false;
				cr.dirty = false;
				dc.setRecord(null);
				cr.phantom = true;
				cr.dirty = true;
			}
			s.rejectChanges();
		}
	},

	discardChildrenChanges : function() {
		var dc = this.dc;
		var dirty = false, l = dc.children.length;
		for ( var i = 0; i < l; i++) {
			if (dc.children[i].isDirty()) {
				dc.children[i].doCancel();
			}
		}
	}

});
