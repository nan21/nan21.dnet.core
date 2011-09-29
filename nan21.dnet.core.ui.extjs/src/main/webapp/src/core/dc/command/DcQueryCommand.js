Ext.define("dnet.base.DcQueryCommand",{
	extend : "dnet.base.AbstractDcAsyncCommand",

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
		var request = dnet.base.RequestParamFactory
				.findRequest(dc.filter.data);
		for ( var p in request.data) {
			if (request.data[p] === "") {
				request.data[p] = null;
			}
		}
		var data = Ext.encode(request.data);
		request.data = data;
		request.params = Ext.encode(dc.params.data);
		dc.store.proxy.extraParams.params = request.params;
		dc.store.proxy.extraParams.data = request.data;
		dc.store.currentPage = 1;
		//dc.setRecord(null);
		
		dc.store.load( {
			//params : request,
			scope : dc
		});
//		dc.store.baseParams = {
//			data : data
//		};
		 

	},

	checkActionState : function() {
		if (dnet.base.DcActionsStateManager
				.isQueryDisabled(this.dc)) {
			throw ("Query is not allowed.");
		}
	}
});
