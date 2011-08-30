Ext.ns("dnet.base");

dnet.base.DcQueryCommand = Ext.extend(dnet.base.AbstractDcAsyncCommand, {

	onExecute : function() {
		var dc = this.dc;
		if ( !dc.isFilterValid() ) {
			Ext.Msg.show({
			   	msg : "Filter contains invalid data. Please fix the incorrect values then try again.",
			   	title: 'Invalid filter data',					 
				icon : Ext.MessageBox.ERROR,
				buttons : {
					ok : 'OK'
				}
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
		dc.store.load( {
			params : request,
			scope : dc
		});
		dc.store.baseParams = {
			data : data
		};
		dc.setRecord(null);

	},

	checkActionState : function() {
		if (dnet.base.DcActionsStateManager.isQueryDisabled(this.dc)) {
			throw ("Query is not allowed.");
		}
	}
});
