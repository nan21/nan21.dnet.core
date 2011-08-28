
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
	this.doQueryTask = null;	
	this.ctxData = null;
	this.autoFetchDelay = 600;
	this.reloadChildrenOnParentInsert = true;
	this.reloadChildrenOnParentUpdate = false;
	
	
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
		
		this.doQueryTask = new Ext.util.DelayedTask(function(){
			this.childDc.doQuery();
		},this);
		
		this.parentDc.on("recordChange", function() { this._updateCtxData_("recordChange"); }, this);		 
		this.childDc.on("updateActionsState", function() {
			this.parentDc.updateActionsState();
		}, this );  
		  
		this.parentDc.store.on("write", function(store, action, result, tx, records) {
			 
			if (this.reloadChildrenOnParentInsert && action == Ext.data.Api.actions.create) {
				this._updateCtxData_("parent_store_write"); 
			}
			if (this.reloadChildrenOnParentUpdate && action == Ext.data.Api.actions.update) {
				this._updateCtxData_("parent_store_write"); 
			}			
		}, this);
		
	}	
 
	/**
	 * @param eventName  
	 */ 
	,_updateCtxData_: function(eventName) {
		dnet.base.Logger.debug("dnet.base.DcContext._updateCtxData_ eventName="+eventName);
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
			dnet.base.Logger.debug("dnet.base.DcContext._updateCtxData_ context data is changed ");
			
			
			dnet.base.DcActionsStateManager.applyStates(this.childDc);
			this._updateChildFilter_();
			this.fireEvent("dataContextChanged", this);
			
			this.childDc.setRecord(null);
			
			this.childDc.store.removeAll(true);
			this.childDc.store.loadData({data:[],totalCount:0}, false);

			
			if (this.relation.fetchMode == "auto" && this.parentDc.getRecord() && !this.parentDc.getRecord().phantom) {
				//this.childDc.doQuery();
				
				this.doQueryTask.delay(this.autoFetchDelay);
				 
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
	 
	,_applyContextData_: function(record) {
		Ext.apply(record.data, this.ctxData);
	}
//	,_onChildModified_: function() {
//		this.parentDc.dataModified();
//	}
//	,_onChildCleaned_: function() {
//		this.parentDc.onChildCleaned();
//	}
});

