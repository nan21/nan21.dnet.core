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

		if (dc.multiEdit) {
			s.rejectChanges();
		} else {
			if (dc.record) {
				dc.record.reject();
			}
			if (dc.record.phantom) {
				/* TODO: check if it is necessary */
				dc.store.remove(dc.record);
				s.rejectChanges();
				/* workaround to avoid the dirty check in AbstractDc */
				var cr = dc.record;
				cr.phantom = false;
				var dcdirty = dc.isDirty();
				dc.setRecord(null);
			}

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
