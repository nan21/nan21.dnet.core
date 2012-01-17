dnet.core.base.Logger = function() {
	return {
		doLogging : false /*(Ext.isDefined(console))? true: false */ 
		,info: function(msg) {
			if (this.doLogging) {
				console.info(msg);
			}
		}
		,warn: function(msg) {
			if (this.doLogging) {
				console.warn(msg);
			}
		}
		,error: function(msg) {
			if (this.doLogging) {
				console.error(msg);
			}
		}
		,debug: function(msg) {
			if (this.doLogging) {
				console.debug(msg);
			}
		}
	}
}();