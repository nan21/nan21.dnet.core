/*dnet.base.AbstractDcCommand = function(config) {
 this.dc = null;
 this.confirmByUser = false;
 this.confirmMessageTitle = "";
 this.confirmMessageBody = "Please confirm action";	 
 this.logger = dnet.base.Logger;
 Ext.apply(this, config);
 };*/
Ext.define("dnet.base.AbstractDcCommand", {

	dc : null,
	confirmByUser : false,
	confirmMessageTitle : "",
	confirmMessageBody : "Please confirm action",
	logger : dnet.base.Logger,

	constructor : function(config) {
        config = config || {};
        Ext.apply(this, config);
        this.callParent(arguments);
    },
    
	beforeExecute : function() {
		return true;
	},

	afterExecute : function() {
	},

	canExecute : function() {
		return true;
	},

	confirmExecute : function(btn, options) {
		if (!btn) {
			Ext.Msg.confirm(this.confirmMessageTitle, this.confirmMessageBody,
					function(btn) {
						this.confirmExecute(btn, options);
					}, this);
		} else {
			if (btn == "yes" || btn == "ok") {
				options.confirmed = true;
				this.execute(options);
			}
		}
	},

	needsConfirm : function() {
		return this.confirmByUser;
	},

	checkActionState : function(options) {
	},

	execute : function(options) {
		options = options || {};
		this.checkActionState();

		if (this.beforeExecute() === false) {
			return false;
		}

		if (this.needsConfirm() && options.confirmed !== true) {
			this.confirmExecute(null, options);
			return;
		}

		this.onExecute(options);

		this.afterExecute(options);
	}
});
