/**
 * Abstract base class for asynchronous commands. An asynchronous command is one
 * which involves an AJAX call so that the result is not available immediately.
 */
Ext.define("dnet.base.AbstractDcAsyncCommand", {

	extend : "dnet.base.AbstractDcCommand",

	onAjaxSuccess : function(response, options) {
		Ext.Msg.hide();
	},

	onAjaxFailure : function(response, options) {
		this.dc.showAjaxErrors(response, options);
	}

});