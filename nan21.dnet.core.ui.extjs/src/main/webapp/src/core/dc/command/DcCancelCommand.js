Ext.ns("dnet.base");

dnet.base.DcCancelCommand = Ext.extend(dnet.base.AbstractDcSyncCommand, {

	onExecute : function() {
		var dc = this.dc;
		
		if (dc.store.getCount() == 0 ) {
			 
			this.discardChanges();
		} else {
			this.discardChildrenChanges();
			this.discardChanges();
		} 
		dc.updateActionsState();  
	},

	discardChanges : function() {
		var dc = this.dc;
//		if (dc.record.phantom) {
//			dc.store.remove(dc.record);
//			dc.setRecord(null);
//		}
//		var s = dc.store;
//		dc.store.rejectChanges();
//		s.each(function(r) {
//			if (r.phantom) {
//				s.remove(r);
//			}
//		}, s); 
		 
		
		if (dc.multiEdit) {
			var s = dc.store;
			s.rejectChanges();
			s.each(function(r) {
				if (r.phantom) {
					s.remove(r);
				}
			}, s);
		} else {
			if (dc.record) {
				dc.record.reject();
			}
			//dc.store.rejectChanges();
			if (dc.record.phantom) {
				dc.store.remove(dc.record);
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
