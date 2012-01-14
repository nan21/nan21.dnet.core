/**
 * Abstract base class for any kind of command. Do not directly subclass this
 * one but use one of the provided children depending on what type of command
 * you need. See the synchronous and asynchronous commands for details.
 */
Ext.define("dnet.base.AbstractDcCommand", {
 
	/**
	 * Data-control on which this command is invoked.
	 */
	dc : null,

	/**
	 * DC API method which delegates to this command
	 * @type String 
	 */
	dcApiMethod: null,
	
	/**
	 * Flag to set if this command needs explicit confirmation from the user in
	 * order to execute.
	 */
	confirmByUser : false,

	locked: false,
	
	/**
	 * User confirmation message title.
	 */
	confirmMessageTitle : "",

	/**
	 * User confirmation message body.
	 */
	confirmMessageBody : "Please confirm action",

	/**
	 * Constructor
	 */
	constructor : function(config) {
		config = config || {};
		Ext.apply(this, config);
		this.callParent(arguments);
	},

	/**
	 * Template method where subclasses or external contexts can provide
	 * additional logic. If it returns false the execution is stopped.
	 */
	beforeExecute : function() {
		return true;
	},

	/**
	 * Template method where subclasses or external contexts can provide
	 * additional logic. Called after the execution is finished. ATTENTION:
	 * Commands which initiate AJAX calls do not have the result of the remote
	 * call available here. Provide callbacks for such situations.
	 */
	afterExecute : function() {
		if(this.dcApiMethod != null) {
			var m = this.dc['afterDo'+this.dcApiMethod];
			if(m!= undefined && Ext.isFunction(m)) {
				m.call(this.dc);
			}			 
		}
	},

	/**
	 * Provide whatever extra-logic to check if the command can be executed.
	 */
	canExecute : function() {
		return true;
	},

	/**
	 * Default routine which ask confirmation from the user to proceed. Called
	 * if confirmByUser = true.
	 */
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

	/**
	 * Calls the appropriate method from the action-state manager.
	 */
	checkActionState : function(options) {
	},

	/**
	 * Command execution entry point.
	 */
	execute : function(options) {
		options = options || {};
		this.checkActionState();

		/* workaround to enable createInterceptor return false beeing handled correctly
		 * Seems that returnValue=false in Ext.Function.createInterceptor returns null not the specified false
		 * Used by AbstractDcvForm to inject its own form validation result.
		 * */
		if (this.beforeExecute() === false || this.beforeExecute() == -1 ) {
			return false; 
		}

		if (this.needsConfirm() && options.confirmed !== true) {
			this.confirmExecute(null, options);
			return;
		}

		this.onExecute(options);

		this.afterExecute(options);
	},

	/**
	 * Empty template method meant to be overriden by the subclasses.
	 * 
	 */
	onExecute : function(option) {
		throw new Exception("Unimplemented onExecute!");
	}

});
