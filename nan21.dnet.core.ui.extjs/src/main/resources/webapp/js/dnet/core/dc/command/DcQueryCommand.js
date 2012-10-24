Ext.define("dnet.core.dc.command.DcQueryCommand",{
	extend : "dnet.core.dc.command.AbstractDcAsyncCommand",

	onExecute : function() {
		var dc = this.dc;
		if (!dc.isFilterValid()) {
			Ext.Msg
					.show( {
						msg : "Filter contains invalid data. Fix the incorrect values then try again.",
						title : 'Invalid filter data',
						icon : Ext.MessageBox.ERROR,
						buttons :Ext.MessageBox.OK
					});
			return;
		}
		var request = dnet.core.base.RequestParamFactory
				.findRequest(dc.filter.data);
		var data = request[Dnet.requestParam.FILTER];
		for ( var p in data) {
			if (data[p] === "") {
				data[p] = null;
			}
		}

		dc.store.proxy.extraParams[Dnet.requestParam.PARAMS] = Ext.encode(dc.params.data);
		dc.store.proxy.extraParams[Dnet.requestParam.FILTER] = Ext.encode(data);
		dc.store.proxy.extraParams[Dnet.requestParam.ADVANCED_FILTER] = Ext.encode(dc.advancedFilter || []);
		dc.store.currentPage = 1;
		
		dc.store.load( {
			scope : dc
		});
	},

	checkActionState : function() {
		if (dnet.core.dc.DcActionsStateManager
				.isQueryDisabled(this.dc)) {
			throw ("Query is not allowed.");
		}
	}
});
