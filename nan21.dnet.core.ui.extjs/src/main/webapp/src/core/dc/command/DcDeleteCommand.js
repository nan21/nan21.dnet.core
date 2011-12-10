Ext.define("dnet.base.DcDeleteCommand", {
	extend : "dnet.base.AbstractDcSyncCommand",

	constructor : function(config) {
		dnet.base.DcDeleteCommand.superclass.constructor.call(this, config);
		this.confirmByUser = true;
		this.confirmMessageTitle = Dnet.translate("msg", "dc_confirm_action");
		this.confirmMessageBody = Dnet.translate("msg",
				"dc_confirm_delete_selection");
	},

	onExecute : function() {
		var dc = this.dc;
		dc.store.remove(dc.getSelectedRecords());
		if (!dc.multiEdit) {
			//dc.store.proxy.extraParams = Ext.encode(dc.params.data);
			dc.store.sync();
		}
		dc.doDefaultSelection();
	},

	checkActionState : function() {
		if (dnet.base.DcActionsStateManager.isDeleteDisabled(this.dc)) {
			throw ("Delete is not allowed.");
		}
	}
});