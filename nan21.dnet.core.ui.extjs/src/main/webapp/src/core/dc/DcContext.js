/**
 * Defines a parent-child relationship between data-controls in a frame.
 */
Ext.define("dnet.base.DcContext", {
	mixins : {
		observable : 'Ext.util.Observable'
	},

	/**
	 * Reference to the parent data-control. Must be specified in initial
	 * configuration.
	 */
	parentDc : null,

	/**
	 * Reference to the child data-control. Must be specified in initial
	 * configuration.
	 */

	childDc : null,
	/**
	 * Relation definition. Must be specified in initial configuration. Supports
	 * the following attributes:
	 * <li>fetchMode: 'auto' Automatically load the children data on parent
	 * record change. </li>
	 * <li>strict: true Enable /disable masterless operations, i.e. load
	 * children outside of the parent context</li>
	 * <li>fields: [ {childField:"field_name", parentField:"field_name"}, {...}
	 * ... ] Relation mapping fields. </li>
	 * 
	 */
	relation : null,

	doQueryTask : null,
	/**
	 * The values for the relation fields, the relation context data.
	 */
	ctxData : null,

	autoFetchDelay : 600,

	/**
	 * Flag used to automatically reload the data in the child DC after a new
	 * parent record has been saved. Useful if the creation of a parent
	 * generates child records in the business logic.
	 */
	reloadChildrenOnParentInsert : true,

	/**
	 * Flag used to automatically reload the data in the child DC after the
	 * parent record has been saved. Useful if the update of a parent alters
	 * data in the children or if the relation contains fields which are allowed
	 * to be modified by the user.
	 */
	reloadChildrenOnParentUpdate : false,

	constructor : function(config) {
		config = config || {};
		if (!config || !config.relation || !config.parentDc) {
			throw (dnet.base.DcExceptions.DCCONTEXT_INVALID_SETUP);
		}

		Ext.apply(this, config);

		if (this.relation.strict == undefined) {
			this.relation["strict"] = true;
		}
		if (this.relation.fetchMode == undefined) {
			this.relation["fetchMode"] = "auto";
		}

		this.addEvents("dataContextChanged");

		this.mixins.observable.constructor.call(this);
		this._setup_();

	},

	_setup_ : function() {

		this._updateCtxData_();

		this.doQueryTask = new Ext.util.DelayedTask(function() {
			this.childDc.doQuery();
		}, this);

		this.parentDc.mon(this.parentDc, "recordChange", function() {
			this._updateCtxData_("recordChange");
		}, this);
		this.childDc.mon(this.childDc, "updateActionsState", function() {
			this.parentDc.updateActionsState();
		}, this);

		this.parentDc.mon(this.parentDc.store, "write", function(store, operation, eopts) {

			if (this.reloadChildrenOnParentInsert
					&& operation.action == "create") {
				this._updateCtxData_("parent_store_write");
			}
			if (this.reloadChildrenOnParentUpdate
					&& operation.action == "update") {
				this._updateCtxData_("parent_store_write");
			}
		}, this);

	},

	/**
	 * Update context data whenever context is changed.
	 */
	_updateCtxData_ : function(eventName) {

		this.ctxData = {};
		var f = this.relation.fields;
		var l = f.length;
		var r = this.parentDc.record;
		var changed = false;
		var nv = null;
		var ov = null;

		for ( var i = 0; i < l; i++) {
			ov = this.ctxData[f[i]["childField"]];
			nv = (r) ? r.get(f[i]["parentField"]) : null;
			this.ctxData[f[i]["childField"]] = nv;
			if (nv !== ov) {
				changed = true;
			}
		}

		if (!eventName) {
			return;
		}

		if (changed) {
			//dnet.base.DcActionsStateManager.applyStates(this.childDc);
			this._updateChildFilter_();
			//this.fireEvent("dataContextChanged", this);

			this.childDc.setRecord(null);

			this.childDc.store.loadData( [], false);

			this.fireEvent("dataContextChanged", this);
			
			if (this.relation.fetchMode == "auto" && this.parentDc.getRecord()
					&& !this.parentDc.getRecord().phantom) {

				this.doQueryTask.delay(this.autoFetchDelay);
			}
		}
	},

	/**
	 * Update the filter values in the child. Called usually after a context change.
	 */
	_updateChildFilter_ : function() {
		var f = this.childDc.filter;
		f.beginEdit();
		for ( var p in this.ctxData) {
			f.set(p, this.ctxData[p]);
		}
		this.childDc.filter.endEdit();
	},

	_applyContextData_ : function(record) {
		Ext.apply(record.data, this.ctxData);
	}

});
