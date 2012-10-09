/**
 * Abstract base class for asynchronous commands. An asynchronous command is one
 * which involves an AJAX call so that the result is not available immediately.
 */
Ext.define("dnet.core.dc.command.AbstractDcAsyncCommand", {

	extend : "dnet.core.dc.command.AbstractDcCommand",

	onAjaxSuccess : function(response, options) {
		Ext.Msg.hide();
	},

	onAjaxFailure : function(response, options) {
		this.dc.showAjaxErrors(response, options);
	}

});