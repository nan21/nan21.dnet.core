Ext.ns("dnet.base");

dnet.base.AbstractDcAsyncCommand = Ext.extend( dnet.base.AbstractDcCommand, {
	
	 onAjaxSuccess: function(response, options) {
		Ext.Msg.hide();  
	}

	,onAjaxFailure: function(response, options) {
		this.dc.showAjaxErrors(response, options);
	}
	
	
});