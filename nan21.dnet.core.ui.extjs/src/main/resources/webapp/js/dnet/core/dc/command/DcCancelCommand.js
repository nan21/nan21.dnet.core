Ext.define("dnet.core.dc.command.DcCancelCommand", {
	extend : "dnet.core.dc.command.AbstractDcSyncCommand",

	onExecute : function() {
		var dc = this.dc;
		if (dc.store.getCount() == 0) {
			this.discardChanges();
		} else {
			this.discardChildrenChanges();
			this.discardChanges();
		}
	},

	discardChanges : function() {

		var dc = this.dc;
		var s = dc.store;

		if (dc.record && dc.record.phantom) {
			/* workaround to avoid the dirty check in AbstractDc.setRecord */
			var cr = dc.record;
			cr.phantom = false;
			cr.dirty = false;
			dc.setRecord(null, true);
			cr.phantom = true;
			cr.dirty = true;
		}

		if (dc.multiEdit) {
			s.rejectChanges();
		} else {
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
