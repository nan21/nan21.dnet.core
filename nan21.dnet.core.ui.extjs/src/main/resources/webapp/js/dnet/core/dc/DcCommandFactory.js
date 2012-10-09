dnet.core.dc.DcCommandFactory = {

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
		return new dnet.core.dc.command.DcQueryCommand( {
			dc : dc
		});
	},

	createClearQueryCommand : function(dc) {
		return new dnet.core.dc.command.DcClearQueryCommand( {
			dc : dc
		});
	},

	createNewCommand : function(dc) {
		return new dnet.core.dc.command.DcNewCommand( {
			dc : dc
		});
	},

	createCopyCommand : function(dc) {
		return new dnet.core.dc.command.DcCopyCommand( {
			dc : dc
		});
	},

	createSaveCommand : function(dc) {
		return new dnet.core.dc.command.DcSaveCommand( {
			dc : dc
		});
	},

	createCancelCommand : function(dc) {
		return new dnet.core.dc.command.DcCancelCommand( {
			dc : dc
		});
	},

	createDeleteCommand : function(dc) {
		return new dnet.core.dc.command.DcDeleteCommand( {
			dc : dc
		});
	}

	,
	createRpcDataCommand : function(dc) {
		return new dnet.core.dc.command.DcRpcDataCommand( {
			dc : dc
		});
	},

	createRpcFilterCommand : function(dc) {
		return new dnet.core.dc.command.DcRpcFilterCommand( {
			dc : dc
		});
	},

	createEditInCommand : function(dc) {
		return new dnet.core.dc.command.DcEditInCommand( {
			dc : dc
		});
	},

	createEditOutCommand : function(dc) {
		return new dnet.core.dc.command.DcEditOutCommand( {
			dc : dc
		});
	},

	createPrevRecCommand : function(dc) {
		return new dnet.core.dc.command.DcPrevRecCommand( {
			dc : dc
		});
	},

	createNextRecCommand : function(dc) {
		return new dnet.core.dc.command.DcNextRecCommand( {
			dc : dc
		});
	},

	createReloadRecCommand : function(dc) {
		return new dnet.core.dc.command.DcReloadRecCommand( {
			dc : dc
		});
	}
};
