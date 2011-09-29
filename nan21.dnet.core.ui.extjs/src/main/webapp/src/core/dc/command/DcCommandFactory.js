dnet.base.DcCommandFactory = {

	/**
	 * List of command names which are not registered as actions either as they
	 * are internal DC commands or not managed as actions.
	 */
	commandNames : function() {
		return [ "RpcData", "RpcFilter" ];
	},

	/**
	 * Create an object of actions for the given data-control and list of action
	 * names.
	 */
	createCommands : function(dc, names) {

		var result = {};
		for ( var i = 0, l = names.length; i < l; i++) {
			var n = names[i];
			result["do" + n] = this["create" + n + "Command"](dc);
		}
		return result;
	},

	createQueryCommand : function(dc) {
		return new dnet.base.DcQueryCommand( {
			dc : dc
		});
	},

	createClearQueryCommand : function(dc) {
		return new dnet.base.DcClearQueryCommand( {
			dc : dc
		});
	},

	createNewCommand : function(dc) {
		return new dnet.base.DcNewCommand( {
			dc : dc
		});
	},

	createCopyCommand : function(dc) {
		return new dnet.base.DcCopyCommand( {
			dc : dc
		});
	},

	createSaveCommand : function(dc) {
		return new dnet.base.DcSaveCommand( {
			dc : dc
		});
	},

	createCancelCommand : function(dc) {
		return new dnet.base.DcCancelCommand( {
			dc : dc
		});
	},

	createDeleteCommand : function(dc) {
		return new dnet.base.DcDeleteCommand( {
			dc : dc
		});
	}

	,
	createRpcDataCommand : function(dc) {
		return new dnet.base.DcRpcDataCommand( {
			dc : dc
		});
	},

	createRpcFilterCommand : function(dc) {
		return new dnet.base.DcRpcFilterCommand( {
			dc : dc
		});
	},

	createEditInCommand : function(dc) {
		return new dnet.base.DcEditInCommand( {
			dc : dc
		});
	},

	createEditOutCommand : function(dc) {
		return new dnet.base.DcEditOutCommand( {
			dc : dc
		});
	},

	createPrevRecCommand : function(dc) {
		return new dnet.base.DcPrevRecCommand( {
			dc : dc
		});
	},

	createNextRecCommand : function(dc) {
		return new dnet.base.DcNextRecCommand( {
			dc : dc
		});
	},

	createReloadRecCommand : function(dc) {
		return new dnet.base.DcReloadRecCommand( {
			dc : dc
		});
	}
};
