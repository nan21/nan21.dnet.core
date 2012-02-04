Ext.define("dnet.core.dc.command.DcCopyCommand", {
	extend : "dnet.core.dc.command.AbstractDcSyncCommand",

	dcApiMethod : dnet.core.dc.DcActionsFactory.COPY,
	
	onExecute : function() {
		var dc = this.dc;
 
		var source = dc.getRecord();
		if (!source) {
			return;
		} 
		var target = source.copy();		 
		target.data.id = null;
		if (target.data.code) {
			target.data.code = null;
		}
		if (target.data.name) {
			target.data.name = 'Copy of ' + target.data.name;
		}
		target.phantom = true;
		target.dirty = true;
		Ext.data.Model.id(target);
		if (dc.dcContext) {
			dc.dcContext._applyContextData_(target);
		}
		dc.setRecord(target);
		dc.store.add(target);
		
		dc.fireEvent("afterDoNew", {
			dc : dc
		});
 
	},

	checkActionState : function() {
		if (dnet.core.dc.DcActionsStateManager.isCopyDisabled(this.dc)) {
			throw ("Copying a record is not allowed.");
		}
	}

});
