/**
 * Factory class used to create the Ext.Action instances for the registered
 * action names. To create other actions register them here, create a command
 * executor and implement the state management rules in DcActionStateManager.
 */
dnet.base.DcActionsFactory = {

	RUN_QUERY: "Query",
	CLEAR_QUERY: "ClearQuery",
	CREATE: "New",
	COPY: "Copy",
	SAVE: "Save",
	DELETE: "Delete",
	CANCEL: "Cancel",
	EDIT_IN: "EditIn",
	EDIT_OUT: "EditOut",
	PREV_REC: "PrevRec",
	NEXT_REC: "NextRec",
	RELOAD_REC: "ReloadRec",
	
	
	/**
	 * List with the names of the registered actions. See the appropriate create
	 * method for the meaning of each of the actions.
	 */
	actionNames : function() {
		return [ this.RUN_QUERY, this.CLEAR_QUERY, 
				this.CREATE, this.COPY, this.SAVE, this.DELETE, this.CANCEL, 
				this.EDIT_IN, this.EDIT_OUT, this.PREV_REC, this.NEXT_REC, this.RELOAD_REC ];
	},

	/**
	 * Create an object of actions for the given data-control and list of action
	 * names.
	 */
	createActions : function(dc, names) {
		var result = {};
		for ( var i = 0, l = names.length; i < l; i++) {
			var n = names[i];
			result["do" + n] = this["create" + n + "Action"](dc);
		}
		return result;
	},

	/**
	 * Create the action to execute a query.
	 */
	createQueryAction : function(dc) {
		return new Ext.Action( {
			name : "doQuery",
			iconCls : "icon-action-fetch",
			disabled : false,
			text : Dnet.translate("tlbitem", "load__lbl"),
			tooltip : Dnet.translate("tlbitem", "load__tlp"),
			scope : dc,
			handler : function() {
				try {
					dc.doQuery();
				} catch (e) {
					dnet.base.DcExceptions.showMessage(e);
				}
			}
		});
	},

	/**
	 * Create the action to clear the filter values.
	 */
	createClearQueryAction : function(dc) {
		return new Ext.Action( {
			name : "doClearQuery",
			iconCls : "icon-action-fetch",
			disabled : false,
			text : Dnet.translate("tlbitem", "clearquery__lbl"),
			tooltip : Dnet.translate("tlbitem", "clearquery__tlp"),
			scope : dc,
			handler : function() {
				try {
					dc.doClearQuery();
				} catch (e) {
					dnet.base.DcExceptions.showMessage(e);
				}
			}
		});
	},

	/**
	 * Create the action to create a new record.
	 */
	createNewAction : function(dc) {
		return new Ext.Action( {
			name : "doNew",
			iconCls : "icon-action-new",
			disabled : false,
			text : Dnet.translate("tlbitem", "new__lbl"),
			tooltip : Dnet.translate("tlbitem", "new__tlp"),
			scope : dc,
			handler : dc.doNew
		});
	},

	/**
	 * Create the action to copy a record in client.
	 */
	createCopyAction : function(dc) {
		return new Ext.Action( {
			name : "doCopy",
			iconCls : "icon-action-copy",
			disabled : true,
			text : Dnet.translate("tlbitem", "copy__lbl"),
			tooltip : Dnet.translate("tlbitem", "copy__tlp"),
			scope : dc,
			handler : dc.doCopy
		});
	},

	/**
	 * Create the action to save changes.
	 */
	createSaveAction : function(dc) {
		return new Ext.Action( {
			name : "doSave",
			iconCls : "icon-action-save",
			disabled : true,
			text : Dnet.translate("tlbitem", "save__lbl"),
			tooltip : Dnet.translate("tlbitem", "save__tlp"),
			scope : dc,
			handler : dc.doSave
		});
	},

	/**
	 * Create the action to delete records.
	 */
	createDeleteAction : function(dc) {
		return new Ext.Action( {
			name : "deleteSelected",
			iconCls : "icon-action-delete",
			disabled : true,
			text : Dnet.translate("tlbitem", "delete_selected__lbl"),
			tooltip : Dnet.translate("tlbitem", "delete_selected__tlp"),
			scope : dc,
			handler : function() {
				dc.doDelete();
			}
		});
	},

	/**
	 * Create the action to cancel changes made to the data-model.
	 */
	createCancelAction : function(dc) {
		return new Ext.Action( {
			name : "doCancel",
			iconCls : "icon-action-rollback",
			disabled : true,
			text : Dnet.translate("tlbitem", "cancel__lbl"),
			tooltip : Dnet.translate("tlbitem", "cancel__tlp"),
			scope : dc,
			handler : function() {
				dc.doCancel();
			}
		});
	},

	/**
	 * Create the action to enter edit-mode.
	 */
	createEditInAction : function(dc) {
		return new Ext.Action( {
			name : "doEdit",
			iconCls : "icon-action-edit",
			disabled : true,
			text : Dnet.translate("tlbitem", "edit__lbl"),
			tooltip : Dnet.translate("tlbitem", "edit__tlp"),
			scope : dc,
			handler : function() {
			}
		});
	},

	/**
	 * Create the action to exit edit-mode.
	 */
	createEditOutAction : function(dc) {
		return new Ext.Action( {
			name : "doLeaveEditor",
			iconCls : "icon-action-back",
			disabled : false,
			text : Dnet.translate("tlbitem", "back__lbl"),
			tooltip : Dnet.translate("tlbitem", "back__tlp"),
			scope : dc,
			handler : function() {
			}
		});
	},

	/**
	 * Create the action to load the previous available record in store as
	 * current record.
	 */
	createPrevRecAction : function(dc) {
		return new Ext.Action( {
			name : "doPrevRec",
			iconCls : "icon-action-previous",
			disabled : false,
			//text : Dnet.translate("tlbitem", "prev_rec__lbl"),
			tooltip : Dnet.translate("tlbitem", "prev_rec__tlp"),
			scope : dc,
			handler : function() {
				try {
					dc.setPreviousAsCurrent();
				} catch (e) {
					dnet.base.DcExceptions.showMessage(e);
				}
			}
		});
	},

	/**
	 * Create the action to load the next available record in store as current
	 * record.
	 */
	createNextRecAction : function(dc) {
		return new Ext.Action( {
			name : "doNextRec",
			iconCls : "icon-action-next",
			disabled : false,
			//text : Dnet.translate("tlbitem", "next_rec__lbl"),
			tooltip : Dnet.translate("tlbitem", "next_rec__tlp"),
			scope : dc,
			handler : function() {
				try {
					dc.setNextAsCurrent();
				} catch (e) {
					dnet.base.DcExceptions.showMessage(e);
				}
			}
		});
	},

	/**
	 * Create the action to reload the current record from server.
	 */
	createReloadRecAction : function(dc) {
		return new Ext.Action( {
			name : "doReloadRec",
			iconCls : "icon-action-refresh",
			disabled : false,
			text : Dnet.translate("tlbitem", "reload_rec__lbl"),
			tooltip : Dnet.translate("tlbitem", "reload_rec__tlp"),
			scope : dc,
			handler : function() {
				try {
					dc.reloadCurrentRecord();
				} catch (e) {
					dnet.base.DcExceptions.showMessage(e);
				}
			}
		});
	}
};