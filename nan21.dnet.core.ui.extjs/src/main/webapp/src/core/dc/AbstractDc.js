Ext.ns("dnet.base");
dnet.base.AbstractDc = function(config) {

	// properties

	this.ds = null;
	this.dsName = "";

	/**
	 * List with action names implemented
	 */
	this.actionNames = null;

	/**
	 * Action instances. Used to create control widgets in UI to be triggered by
	 * user, mainly toolbar items.
	 */
	this.actions = null;

	/**
	 * Executable functions. Implements workers for API methods of a
	 * data-control.
	 */
	this.commands = null;

	/**
	 * Allow to edit more than one record at once.
	 */
	this.multiEdit = false;

	/**
	 * Filter model instance. Has the same signature as the data model instance
	 */
	this.filter = null;

	/**
	 * Data model instance.
	 */
	this.record = null;

	/**
	 * Data model signature - fields definition.
	 */
	this.recordFields = null;

	/**
	 * Data model signature - record constructor.
	 */
	this.RecordModel = null;

	/**
	 * Parameters model instance
	 */
	this.params = null;

	/**
	 * Parameters model signature - fields definition.
	 */
	this.paramFields = null;

	/**
	 * Parameters model signature - record constructor.
	 */
	this.ParamModel = null;

	/**
	 * Keep track of the selected records
	 */
	this.selectedRecords = [];

	/**
	 * Various runtime configuration properties.
	 */
	this.tuning = {

		/**
		 * Number of milliseconds before execute the query. Used if value>0
		 */
		queryDelay : 150

		/**
		 * Page-size for a query
		 */
		,
		fetchSize : 30
	};

	/**
	 * Children data-controls, similar to a `HasMany` association.
	 */
	this.children = [];

	/**
	 * Parent data-control, similar to a `BelongsTo` association.
	 */
	this.parent = null;

	/**
	 * Array with form-views registered to data-binding.
	 */
	this.bindedFormViews = null;

	/**
	 * Array with filter-views registered to data-binding.
	 */
	this.bindedFilterViews = null;

	/**
	 * Should apply a default selection on store load ?
	 */
	this.afterStoreLoadDoDefaultSelection = true;

	/**
	 * Local reference to the data-source store.
	 */
	this.store = null;

	Ext.apply(this, config);

	this.addEvents(

	/**
	 * Record instance changed
	 */
	"recordChange",

	/**
	 * Data-control status status changed: record state change: clean / dirty
	 * record status change: new record / persisted
	 
	"statusChange",*/

	/**
	 * Selected records changed
	 */
	"selectionChange"

	);
	this.recordFields = this.ds.recordFields;
	this.paramFields = this.ds.paramFields;

	this.dcContext = null;
	this._trl_ = null;

	this.store = new Ext.data.Store( {
		remoteSort : true,
		pruneModifiedRecords : true,
		proxy : new Ext.data.HttpProxy( {
			api : Dnet.dsAPI(this.ds.dsName, "json")
		}),
		reader : new Ext.data.JsonReader( {
			totalProperty : 'totalCount',
			idProperty : 'id',
			root : 'data',
			messageProperty : 'message'
		}, Ext.data.Record.create(this.recordFields)),
		writer : new Ext.data.JsonWriter( {
			encode : true,
			writeAllFields : true
		}),
		autoSave : false,
		listeners : {
			"exception" : {
				fn : this.proxyException,
				scope : this
			}
		}
	});
	dnet.base.AbstractDc.superclass.constructor.call(this, config);
	this._setup_();
};

Ext.extend(dnet.base.AbstractDc, Ext.util.Observable, {

	_setup_ : function() {

		this.dsName = this.ds.dsName;

		this.RecordModel = Ext.data.Record.create(this.recordFields);
		this.ParamModel = Ext.data.Record.create(this.paramFields);
		this.setFilter(new this.RecordModel(this
				.emptyFilterData(this.recordFields)));
		this.setParams(new this.ParamModel(this
				.emptyParamData(this.paramFields)));

		this.actionNames = dnet.base.DcActionsFactory.actionNames();
		this.commandNames = dnet.base.DcCommandFactory.commandNames();
		
		this.actions = dnet.base.DcActionsFactory.createActions(this,
				this.actionNames);
		this.commands = dnet.base.DcCommandFactory.createCommands(this,
				this.commandNames.concat(this.actionNames));
		 
		// register listeners

		// if Query action is disabled do not execute it.
		this.store.on("beforeload", function(store, options) {
			if (dnet.base.DcActionsStateManager.isQueryDisabled(this)) {
				return false;
			}
		}, this);

		this.store.on("update", function() {
			dnet.base.Logger.debug("dnet.base.AbstractDc ("+this.dsName+") -> store.on.update event handler");
			this.fireEvent("statusChange", {dc:this});
			this.updateActionsState();
		}, this);

		this.store.on("add", function(store, records, index) {
			dnet.base.Logger.debug("dnet.base.AbstractDc ("+this.dsName+") -> store.on.add event handler");
			//this.setSelectedRecords(records);
			//this.updateActionsState();
		}, this);

		this.store.on("remove", function(store, records, index) {
			dnet.base.Logger.debug("dnet.base.AbstractDc ("+this.dsName+") -> store.on.remove event handler");
			//this.updateActionsState(); 
			//this.doDefaultSelection();
			
		}, this);
		this.store.on("save", function(store, batch, data) {
			dnet.base.Logger.debug("dnet.base.AbstractDc ("+this.dsName+") -> store.on.remove event handler");
			//this.updateActionsState(); 
			//this.doDefaultSelection();
			
		}, this);
		this.store.on("clear", function(store, records) {
			dnet.base.Logger.debug("dnet.base.AbstractDc ("+this.dsName+") -> store.on.remove event handler");
			//this.updateActionsState(); 
			//this.doDefaultSelection();
			
		}, this);
		// after the store is loaded apply an initial selection
		if (this.afterStoreLoadDoDefaultSelection) {
			this.store.on("load", function(store, records, options) {
				if (this.afterStoreLoadDoDefaultSelection) {
					this.doDefaultSelection();
				}					
			}, this);
		}

		// invoke the action state update whenever necessary
		this.on("recordChange", this.updateActionsState, this );
		this.on("selectionChange", this.updateActionsState, this );

 
		
		// ************************************************
		// to be reviewd
		// ************************************************

		this.store.on("write", function(store, action, result, tx, records) {
			if (action == Ext.data.Api.actions.update) {
				this.afterDoSaveSuccess();
			}
			if (action == Ext.data.Api.actions.create) {
				this.afterDoSaveSuccess();
			}
			if (action == Ext.data.Api.actions.destroy) {
				this.afterDoSaveSuccess();
			}
			this.updateActionsState(); 
			//this.onStoreDataChange();

		}, this);

	},
 
	
	/** ************************************************************************* */
	/** *********************** Public API ****************************** */
	/** ************************************************************************* */

	/**
	 * Execute query to fetch data.
	 */

	doQuery : function() {
		this.commands.doQuery.execute();
	},

	/**
	 * Clear query criteria -> reset filter to its initial state
	 */
	doClearQuery : function() {
		this.commands.doClearQuery();
	},

	/**
	 * Create a new record.
	 */
	doNew : function() {
		this.commands.doNew.execute();
	},

	/**
	 * Copy the current record reset its ID and make it current record ready to
	 * be edited.
	 */
	doCopy : function() {
		this.commands.doCopy.execute();
	},

	/**
	 * Save changes.
	 */
	doSave : function() {
		this.commands.doSave.execute();
	},

	/**
	 * Discard changes to the last clean state.
	 */
	doCancel : function() {
		this.commands.doCancel.execute();
	},

	/**
	 * Delete current record.
	 */
	doDelete : function() {
		this.commands.doDelete.execute();
	},

	/**
	 * Delete selected records.
	 */
	doDeleteSelection : function() {
		this.commands.doDelete.execute();
	},

	/**
	 * Reload the current record data from server
	 */
	doReloadRecord : function() {
		this.commands.doReloadRec.execute();
	},

	/**
	 * Deprecated: Alias for doReloadRecord Shall be removed
	 */
	doRefreshCurrent : function() {
		this.doReloadRecord();
	},

	/**
	 * Call a server side RPC with the filter instance
	 */
	doRpcFilter : function(options) {
		this.commands.doRpcFilter.execute(options);
	},
	/**
	 * Deprecated: Alias for doRpcFilter Shall be removed
	 */
	doServiceFilter : function(serviceName, specs) {
		this.doRpcFilter(Ext.apply(specs||{}, {name:serviceName}));
	},
	
	
	/**
	 * Call a server side RPC with the model instance
	 */
	doRpcData : function(options) {
		this.commands.doRpcData.execute(options);
	},
	/**
	 * Deprecated: Alias for doRpcData Shall be removed
	 */
	doService: function(serviceName, specs) {
		this.doRpcData(Ext.apply(specs, {name:serviceName}));
	},
	
	
	/**
	 * Set the previous available record as current record.
	 */
	setPreviousAsCurrent : function() {
		this.commands.doPrevRec.execute();
	},

	/**
	 * Set the next available record as current record.
	 */
	setNextAsCurrent : function() {
		this.commands.doNextRec.execute();
	},

	// --------------- other ---------------

	/**
	 * Filter validator. It should get interceptor functions chain injected by
	 * the filter forms.
	 */
	isFilterValid : function() {
		return true;
	},

	/**
	 * Record validator. It should get interceptor functions chain injected by
	 * the editor forms.
	 */
	isRecordValid : function() {
		return true;
	},

	/**
	 * Get current record state: dirty/clean
	 */
	getRecordState : function() {
		if (this.record)
			return (this.isCurrentRecordDirty()) ? 'dirty' : 'clean';
		else
			return null;
	},

	/**
	 * Get current record status: insert/update
	 */
	getRecordStatus : function() {
		if (this.record)
			return (this.record.phantom) ? 'insert' : 'update';
		else
			return null;
	},

	/**
	 * Update the enabled/disabled states of the actions. Delegate the work to
	 * the states manager.
	 */
	updateActionsState : function() {		
		dnet.base.DcActionsStateManager.applyStates(this);
		this.fireEvent("updateActionsState", {dc:this});
	},

	/**
	 * Returns true if any of the child data-controls is dirty
	 */
	isAnyChildDirty : function() {
		var dirty = false, l = this.children.length;
		for ( var i = 0; i < l; i++) {
			if (this.children[i].isDirty()) {
				dirty = true;
				i = l;
			}
		}
		return dirty;
	},

	/**
	 * Returns true if the current record instance is dirty
	 */
	isCurrentRecordDirty : function() {
		if (this.record && this.record.dirty) {
			return true;
		}
		return false;
	},

	/**
	 * Returns true if the store is dirty. Is relevant only if
	 * <code>multiEdit=true</code>
	 */
	isStoreDirty : function() {
		return this.store.getModifiedRecords().length > 0
				|| this.store.removed.length > 0;
	},

	/**
	 * Returns true if the data-control is dirty i.e either some the own records
	 * or any child
	 */
	isDirty : function() {
		return this.isCurrentRecordDirty() || this.isStoreDirty()
				|| this.isAnyChildDirty();
	},

	/**
	 * Default initial selection
	 */
	doDefaultSelection : function() {
		if (this.store.getCount() > 0) {
			//this.setRecord(this.store.getAt(0));			
			this.setSelectedRecords( [ this.store.getAt(0) ]);
		} else {
			// force reset
			//this.setRecord(null);
			this.setSelectedRecords( []);
		}
	},

	// --------------------- getters / setters ----------------------

	/**
	 * Returns the selected records
	 */
	getSelectedRecords : function() {
		return this.selectedRecords;
	},

	/**
	 * Set the selected records
	 */
	setSelectedRecords : function(recArray) {
		if (this.selectedRecords != recArray) {
			this.selectedRecords = recArray;
			if (recArray.length == 0 ) {
				this.setRecord(null);				
			} else {
				if (this.record != recArray[0]) {
					this.setRecord(recArray[0]);		
				}
			}			
			this.fireEvent('selectionChange', {
				dc : this
			});
		} 
	},

	/**
	 * Returns the filter instance
	 */
	getFilter : function() {
		return this.filter;
	},

	/**
	 * Set the filter instance
	 */
	setFilter : function(v) {
		var of = this.filter;
		this.filter = v;
		this.fireEvent("filterChanged", {
			dc : this,
			newFilter : this.filter,
			oldFilter : of
		});
	},

	/**
	 * Get filter property value
	 */
	getFilterValue : function(n) {
		return this.filter.get(n);
	},

	/**
	 * Set filter property value
	 */
	setFilterValue : function(n, v, silent) {
		var ov = this.filter.get(n);
		if (ov != v) {
			this.filter.set(n, v);
			if (!(silent === true)) {
				this.fireEvent("filterValueChanged", this, name, ov, v);
			}
		}
	},

	/**
	 * Get the parameters instance
	 */
	getParams : function() {
		return this.params;
	},

	/**
	 * Set the parametr instance
	 */
	setParams : function(v) {
		this.params = v;
	},

	/**
	 * Get parameter property value
	 */
	getParamValue : function(n) {
		return this.params.get(n);
	},

	/**
	 * Set parameter property value
	 */
	setParamValue : function(n, v, silent) {
		var ov = this.params.get(n);
		if (ov != v) {
			this.params.set(n, v);
			if (!(silent === true)) {
				this.fireEvent("parameterValueChanged", this, name, ov, v);
			}
		}
	},

	/**
	 * Returns the current record
	 */
	getRecord : function() {
		return this.record;
	},

	/**
	 * Template method to override with instance specific logic in case is
	 * necessary
	 */
	beforeSetRecord : function() {
		return true;
	},

	/**
	 * Set current record
	 */
	setRecord : function(p) {
		if (!this.multiEdit) {
			if (this.isCurrentRecordDirty()) {
				throw (dnet.base.DcExceptions.DIRTY_DATA_FOUND);
			}
		}
		p = (p != undefined) ? p : null;
		if (this.beforeSetRecord() == false) {
			return false;
		}
		var rec, idx, changed = false, oldrec;
		if (p != null) {
			if (Ext.isNumber(p)) {
				idx = p;
				rec = this.store.getAt(p);
				if (rec && (this.record != rec)) {
					oldrec = this.record;
					this.record = rec;
					changed = true;
				}
			} else {
				rec = p;
				idx = this.store.indexOf(p);
				if (rec && (this.record != rec)) {
					oldrec = this.record;
					this.record = rec;
					changed = true;
				}
			}
		} else {
			oldrec = this.record;
			this.record = rec;
			changed = (oldrec != null);

		}
		if (changed) {
			// this.addToSelectedRecords(rec);
			this.fireEvent('recordChange', {
				dc : this,
				newRecord : rec,
				oldRecord : oldrec,
				newIdx : idx,
				status : this.getRecordStatus()
			});
		}
	},

	/**
	 * Return parent data-control
	 */
	getParent : function() {
		return (this.dcContext)?this.dcContext.parentDc:null;
	},

	/**
	 * Return children data-controls list
	 */
	getChildren : function() {
		return this.children;
	},

	/** ************************************************************************* */
	/** *********************** Internal API ****************************** */
	/** ************************************************************************* */

	/**
	 * Initialize a new record instance with empty data. TODO: needs to be
	 * reviewed
	 */
	emptyRecordData : function(fd) {
		var r = {};
		r["clientId"] = getApplication().getSession().client.id;
		for ( var i = 0; i < fd.length; i++) {
			if (fd[i]["name"] != "clientId") {
				if (fd[i]["type"] == "string") {
					r[fd[i]["name"]] = "";
				} else {
					if (fd[i]["type"] == "boolean") {
						r[fd[i]["name"]] = false;
					} else {
						r[fd[i]["name"]] = null;
					}
				}
			}
		}
		return r;
	},

	/**
	 * Initialize a new filter instance with empty data. TODO: needs to be
	 * reviewed
	 */
	emptyFilterData : function(fd) {
		var r = {};
		r["clientId"] = getApplication().getSession().client.id;
		for ( var i = 0; i < fd.length; i++) {
			if (fd[i]["name"] != "clientId") {
				if (fd[i]["type"] == "string") {
					r[fd[i]["name"]] = "";
				} else {
					r[fd[i]["name"]] = null;
				}
			}
		}
		return r;
	},

	/**
	 * Initialize a new parameters instance with empty data. TODO: needs to be
	 * reviewed
	 */
	emptyParamData : function(fd) {
		var r = {};
		for ( var i = 0; i < fd.length; i++) {
			if (fd[i]["type"] == "string") {
				r[fd[i]["name"]] = "";
			} else {
				r[fd[i]["name"]] = null;
			}
		}
		return r;
	},

	/**
	 * Default proxy-exception handler
	 */
	proxyException : function(dataProxy, type, action, options, response, arg) {
		if (type == "response") {
			this.showAjaxErrors(response, options);
		} else {
			if (!Ext.isEmpty(response.message)) {
				alert(response.message.substr(0, 1500));
			} else {
				alert("Exception returned by server with no message.");
			}
		}
	},

	/**
	 * Show errors to user. TODO: Externalize it as command.
	 */
	showAjaxErrors : function(response, options) {
		Ext.MessageBox.hide();
		var msg, withDetails = false;
		if (response.responseText) {
			if (response.responseText.length > 2000) {
				msg = response.responseText.substr(0, 2000);
				withDetails = true;
			} else {
				msg = response.responseText;
			}
		} else {
			msg = "No response received from server.";
		}
		var alertCfg = {
			msg : msg,
			scope : this,
			icon : Ext.MessageBox.ERROR,
			buttons : {
				ok : 'OK'
			}
		}
		if (withDetails) {
			alertCfg.buttons['cancel'] = 'Details';
			alertCfg['detailedMessage'] = response.responseText;
		}
		Ext.Msg.show(alertCfg);

	},

	/**
	 * Fire a "recordChange" event
	 * 
	 * dataModified : function() { // this.fireEvent("dirtyRecord", this);
	 * this.fireEvent("recordChange", { dc : this, record : this.record, state :
	 * this.getRecordState(), status : this.getRecordStatus(), oldRecord : null
	 * }); },
	 */
	/**
	 * Register a child data-control
	 */
	addChild : function(dc) {
		this.children[this.children.length] = dc;
		//dc.on("recordChange", this.updateActionsState, this);
	},

	/**
	 * Register a data-control view for data binding management
	 */
	addBindedView : function(id, type) {
		if (type == "edit-form") {
			this.addBindedFormView(id);
		}
		if (type == "filter-form") {
			this.addBindedFilterView(id);
		}
	},

	/**
	 * Register a data-control form-view for data binding.
	 */
	addBindedFormView : function(id) {
		if (this.bindedFormViews == null) {
			this.bindedFormViews = [];
		}
		this.bindedFormViews[this.bindedFormViews.length] = id;

		this.on('recordChange', function(evnt) {
			var newRecord = evnt.newRecord;
			var oldRecord = evnt.oldRecord;
			var newIdx = evnt.newIdx;
			if (newRecord) {
				Ext.BindMgr.unbind(oldRecord);
				Ext.BindMgr.bind(newRecord, this.bindedFormViews);
			} else {
				Ext.BindMgr.unbind(oldRecord);
			}
		}, this);

	},

	/**
	 * Register a data-control filter-form view for data binding.
	 */
	addBindedFilterView : function(id) {
		if (this.bindedFilterViews == null) {
			this.bindedFilterViews = [];
		}
		this.bindedFilterViews[this.bindedFilterViews.length] = id;

		this.on('filterChanged', function(evnt) {
			var newFilter = evnt.newFilter;
			var oldFilter = evnt.oldFilter;
			if (newFilter) {
				Ext.BindMgr.unbind(oldFilter);
				Ext.BindMgr.bind(newFilter, this.bindedFilterViews);
			} else {
				Ext.BindMgr.unbind(oldFilter);
			}
		}, this);
	},

	// ************************************************
	// to be reviewd
	// ************************************************

	afterDoQuerySuccess : function() {
		this.fireEvent("afterDoQuerySuccess", this);
	},
	afterDoQueryFailure : function() {
		this.fireEvent("afterDoQueryFailure", this);
	}

	,
	beforeDoSave : function() {
		this.fireEvent("beforeDoSave", this);
	},
	afterDoSave : function() {
		this.fireEvent("afterDoSave", this);
	},
	afterDoSaveSuccess : function() {
		this.fireEvent("afterDoSaveSuccess", this);
	},
	afterDoSaveFailure : function() {
		this.fireEvent("afterDoSaveFailure", this);
	}

	,
	doEdit : function() {
		this.onEdit();
	},
	onEdit : function() {

		this.fireEvent("onEdit", this);
	}

	/**
	 * ************ SERVICE DATA *********************
	 */

	,
	doServiceUrl : function(serviceName, specs) {
		if (Ext.isEmpty(this.record)) {
			throw (dnet.base.DcExceptions.NO_CURRENT_RECORD);
		}
		var s = specs || {};
		 
		var p = {
			data : Ext.encode(this.record.data)
		};
		p[Dnet.requestParam.SERVICE_NAME_PARAM] = serviceName;
		p["rpcType"] = "data";
		if (s.modal) {
			Ext.Msg.progress('Working...');
		}
		return Dnet.dsAPI(this.dsName, "stream").service + "&"
				+ Ext.urlEncode(p);// + method:"POST", params: p
	}

	/**
	 * Default AJAX request failure handler.
	 */
	,
	onAjaxRequestSuccess : function(response, options) {
		Ext.MessageBox.hide();
		var o = options.options || {};
		if (o.action) {
			if (o.action == "doQuery") {
				this.afterDoQueryFailure();
			}
			if (o.action == "doSave") {
				this.afterDoSaveFailure();
			}
			if (o.action == "doService") {
				this.afterDoServiceSuccess(response, o.serviceName, o.specs);
			}
			if (o.action == "doServiceFilter") {
				this.afterDoServiceFilterSuccess(response, o.serviceName,
						o.specs);
			}
		}
	}

	/**
	 * Default AJAX request failure handler.
	 */
	,
	onAjaxRequestFailure : function(response, options) {

		var o = options.options || {};
		if (o.action) {
			if (o.action == "doQuery") {
				this.afterDoQueryFailure();
			}
			if (o.action == "doSave") {
				this.afterDoSaveFailure();
			}
			if (o.action == "doService") {
				this.afterDoServiceFailure(response, o.serviceName, o.specs);
			}
			if (o.action == "doServiceFilter") {
				this.afterDoServiceFilterFailure(response, o.serviceName,
						o.specs);
			}
		}
	}

	,
	setDcContext : function(dcCtx) {
		this.dcContext = dcCtx;
		this.dcContext.on("dataContextChanged",
				function(dctx) {

					dnet.base.DcActionsStateManager.applyStates(this);
					if (dctx.parentDc.getRecord()
							&& dctx.parentDc.getRecord().phantom) {

						this.fireEvent("inContextOfNewRecord", this); /*
																		 * is
																		 * this
																		 * still
																		 * useful ?
																		 */
					} else {
						this.fireEvent("inContextOfEditRecord", this);/*
																		 * is
																		 * this
																		 * still
																		 * useful ?
																		 */
					}
				}, this);
	}

	,
	isRecordChangeAllowed : function() {
		return (!(this.isAnyChildDirty() || ((!this.multiEdit) && this
				.isCurrentRecordDirty())));
	}

	,
	onCleanDc : function() {
		this.fireEvent('cleanDc', {
			dc : this
		});
		if (this.dcContext != null) {
			this.dcContext._onChildCleaned_();
		}
	},
	onChildCleaned : function() {
		if (!this.isStoreDirty() && !this.isAnyChildDirty()) {
			this.onCleanDc();
		}
	}

});
