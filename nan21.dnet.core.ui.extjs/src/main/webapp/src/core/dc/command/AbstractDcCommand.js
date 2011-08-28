Ext.ns("dnet.base");


dnet.base.AbstractDcCommand = function(config) {
	this.dc = null;
	this.confirmByUser = false;
	this.confirmMessageTitle = "";
	this.confirmMessageBody = "Please confirm action";	 
	this.logger = dnet.base.Logger;
	Ext.apply(this, config);
};

Ext.override(dnet.base.AbstractDcCommand, {
	
	beforeExecute:function() {
		return true;
	}
	
	,afterExecute:function() {		
	}
	
	,canExecute: function() {
		return true;
	}
	
	,confirmExecute: function(btn,options) {	
		if (!btn) {			 
        	Ext.Msg.confirm(
        			this.confirmMessageTitle
        			,this.confirmMessageBody
        			,function(btn) { this.confirmExecute(btn,options); }, this);
		} else {
			if (btn == "yes" || btn == "ok" ) {
				options.confirmed=true;
				this.execute(options); 
			}
		}
	}
	
	,needsConfirm: function() {
		return this.confirmByUser;
	}
  
	,checkActionState: function(options) {
	}
	
	,execute: function(options) {
		options = options || {};
		this.checkActionState();					 
		
		if (this.beforeExecute() === false) {
			return false;
		}
		
		if (this.needsConfirm() && options.confirmed !== true) {
			this.confirmExecute(null,options);
			return;
		}
		
		this.onExecute(options);
		
		this.afterExecute(options);
	}
});

