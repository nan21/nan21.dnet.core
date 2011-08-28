Ext.ns("dnet.base");

dnet.base.DcQueryCommand = Ext.extend(dnet.base.AbstractDcAsyncCommand, {

	onExecute : function() {

		var request = dnet.base.RequestParamFactory
				.findRequest(this.dc.filter.data);
		for ( var p in request.data) {
			if (request.data[p] === "") {
				request.data[p] = null;
			}
		}
		var data = Ext.encode(request.data);
		request.data = data;
		request.params = Ext.encode(this.dc.params.data);
		this.dc.store.load( {
			params : request,
			scope : this.dc
		});
		this.dc.store.baseParams = {
			data : data
		};
		this.dc.setRecord(null);

	},

	checkActionState : function() {
		if (dnet.base.DcActionsStateManager.isQueryDisabled(this.dc)) {
			throw ("Query is not allowed.");
		}
	}
});
