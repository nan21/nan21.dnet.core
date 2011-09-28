Ext.define("dnet.base.DcCancelCommand", {
	extend : "dnet.base.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;

		if (dc.store.getCount() == 0) {
			this.discardChanges();			 
		} else {
			this.discardChildrenChanges();
			this.discardChanges();			
		}
		dc.updateActionsState();
	},

	discardChanges : function() {
		var dc = this.dc;
		var s = dc.store;
		if (dc.record && dc.record.phantom) {
			dc.record = null;
		}
		s.rejectChanges();
		 
		if (dc.record == null) {
			dc.fireEvent('recordChange', {
				dc : dc,
				newRecord : null,
				oldRecord : null,
				newIdx : null,
				status : null
			});
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
