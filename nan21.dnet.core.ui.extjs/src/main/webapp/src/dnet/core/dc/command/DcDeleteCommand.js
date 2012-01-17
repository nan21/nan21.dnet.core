Ext.define("dnet.core.dc.command.DcDeleteCommand", {
	extend : "dnet.core.dc.command.AbstractDcSyncCommand",

	constructor : function(config) {		 
		this.callParent(arguments);
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
		if (dnet.core.dc.DcActionsStateManager.isDeleteDisabled(this.dc)) {
			throw ("Delete is not allowed.");
		}
	}
});