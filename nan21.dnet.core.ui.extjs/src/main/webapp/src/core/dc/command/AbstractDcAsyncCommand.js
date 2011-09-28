
Ext.define("dnet.base.AbstractDcAsyncCommand", {
	
	extend : "dnet.base.AbstractDcCommand",

	onAjaxSuccess : function(response, options) {
		Ext.Msg.hide();
	},
	
	onAjaxFailure : function(response, options) {
		this.dc.showAjaxErrors(response, options);
	}

});