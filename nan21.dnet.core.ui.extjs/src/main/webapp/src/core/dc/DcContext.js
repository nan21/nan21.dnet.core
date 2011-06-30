
Ext.ns("dnet.base");
/**
 * Defines a parent-child relationship. 
 * @param: parentDc Reference to the parent data-control. Must be specified in initial configuration.
 * @param: relation Relation definition. It is of type:
 * <code>{ 
 * 		 fetchMode: 'auto' 
 * 		,strict: true // do not allow masterless operations ; default is true
 * 		,fields: [ {childField:"field_name", parentField:"field_name"}, {...} ... ]
 * 	}</code> 
 *  Must be specified in initial configuration
 * 
 */
dnet.base.DcContext = function(config) {	
	
	this.parentDc = null;
	this.childDc = null;
	this.relation = null; 
		
	this.ctxData = null;
	
	if (!config || !config.relation || !config.parentDc ) {
		throw(dnet.base.DcExceptions.DCCONTEXT_INVALID_SETUP);
	}
	
	Ext.apply(this,config);
	
	if (this.relation.strict == undefined) {this.relation["strict"] = true; }
	if (this.relation.fetchMode == undefined) {this.relation["fetchMode"] = "auto"; }
	
	this.addEvents("dataContextChanged");
	
	dnet.base.DcContext.superclass.constructor.call(this, config);
	this._setup_();
};
Ext.extend(dnet.base.DcContext, Ext.util.Observable, {

	 _setup_: function () {
		
		this._updateCtxData_();	
		
		this.parentDc.on("afterCurrentRecordChange", function() { this._updateCtxData_("afterCurrentRecordChange"); }, this);
		this.parentDc.on("afterDoSaveSuccess", function() { this._updateCtxData_("afterDoSaveSuccess"); }, this);
		this.parentDc.on("afterDoNew", function() { this._updateCtxData_("afterDoNew"); }, this);
		//this.childDc.on("beforeDoNew", this._checkParentIsNew_, this);
		//this.childDc.on("beforeDoCopy", this._checkParentIsNew_, this);
		//this.childDc.on("afterDoNew", this._onChildModified_,  this);
		
		
		this.childDc.store.on("beforeload", this._checkParentIsNew_, this);
		this.parentDc.store.on("write", function(store, action, result, tx, recs) {			 
				this._updateCtxData_("afterDoSave");
		} , this);
	}	
 
	/**
	 * @param eventName  
	 */ 
	,_updateCtxData_: function(eventName) {
		this.ctxData = {};		
		var f = this.relation.fields, l=f.length, r=this.parentDc.record, changed=false, nv=null,ov=null;
		for(var i=0; i<l; i++) {
			ov = this.ctxData[f[i]["childField"]];
			nv = (r)?r.get(f[i]["parentField"]):null;
			this.ctxData[f[i]["childField"]] = nv;
			if (nv !== ov) changed = true; 
		}
		if ( !eventName ) return;
		if (changed) {			
			this._updateChildFilter_();
			this.fireEvent("dataContextChanged", this);
			
			this.childDc.setCurrentRecord(null);
			
			this.childDc.store.removeAll(true);
			this.childDc.store.loadData({data:[],totalCount:0}, false);
//			this.childDc.store.commitChanges();
			
			if (this.relation.fetchMode == "auto" && this.parentDc.getRecord() && !this.parentDc.getRecord().phantom) {
				//this.childDc.doQuery();	
				this.childDc.doQuery.defer(500, this.childDc);
				//this.doQueryImpl.defer(this.tuning.queryDelay, this);
			}			
		}		
	}
 
	,_updateChildFilter_: function() {
		var f = this.childDc.filter; 
		f.beginEdit();
		for (var p in this.ctxData) {
			f.set(p, this.ctxData[p]);
		}
		this.childDc.filter.endEdit();
	}
	
	,_checkParentIsNew_: function(store, options) {
		if (!this.parentDc.getRecord() || this.parentDc.getRecord().phantom) {return false;}
		return true;
	}
	
	,_checkCanDoNew_ : function() {
		if (this.relation.strict && (!this.parentDc.getRecord() || this.parentDc.getRecord().phantom  ) ) {
			throw(dnet.base.DcExceptions.PARENT_RECORD_NEW);
		}
	}
	,_checkCanDoCopy_ : function() {
		if (this.relation.strict && (!this.parentDc.getRecord() || this.parentDc.getRecord().phantom  ) ) {
			throw(dnet.base.DcExceptions.PARENT_RECORD_NEW);
		}
	}
	,_applyContextData_: function(record) {
		Ext.apply(record.data, this.ctxData);
	}
	,_onChildModified_: function() {
		this.parentDc.dataModified();
	}
});

