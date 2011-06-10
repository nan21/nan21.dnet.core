Ext.ns("dnet.base");
dnet.base.AbstractDs = function(config) {

	this.dsName = "";
	this.store = null;

	this.filter = null;

	this.record = null;
	this.recordFields = null;
	this.RecordModel = null;

	this.params = null;
	this.paramFields = null;
	this.paramModel = null;

	this.fetchSize = 30;

	Ext.apply(this, config);

	dnet.base.AbstractDs.superclass.constructor.call(this, config);
	//this._setup_();
};

Ext.extend(dnet.base.AbstractDs, Ext.util.Observable, {
	
	
});



