Ext.define("dnet.base.AbstractDc", {
	
	mixins : {
		observable : 'Ext.util.Observable'
	},

	 
	dsName : "",

	/**
	 * List with action names implemented
	 */
	actionNames : null,

	/**
	 * Action instances. Used to create control widgets in UI to be triggered by
	 * user, mainly toolbar items.
	 */
	actions : null,

	/**
	 * Executable functions. Implements workers for API methods of a
	 * data-control.
	 */
	commands : null,

	/**
	 * Allow to edit more than one record at once.
	 */
	multiEdit : false,

	/**
	 * Filter model instance. Has the same signature as the data model instance
	 */
	filter : null,

	/**
	 * Data model instance.
	 */
	record : null,
 
	
	/**
	 * Parameters model instance
	 */
	params : null,

	/**
	 * Data model signature - record constructor.
	 */
	recordModel : null,

	/**
	 * Filter model signature - filter constructor.
	 * Defaults to recordModel if not specified.
	 */
	filterModel : null,
	
	/**
	 * Parameters model signature - record constructor.
	 */
	paramModel : null,

	/**
	 * Keep track of the selected records
	 */
	selectedRecords : null,

	/**
	 * Various runtime configuration properties.
	 */
	tuning : {

		/**
		 * Number of milliseconds before execute the query. Used if value>0
		 */
		queryDelay : 150

		/**
		 * Page-size for a query
		 */
		,
		fetchSize : 30
	},

	/**
	 * Children data-controls, similar to a `HasMany` association.
	 */
	children : null,

	/**
	 * Parent data-control, similar to a `BelongsTo` association.
	 */
	parent : null,

	/**
	 * Array with form-views registered to data-binding.
	 */
	bindedFormViews : null,

	/**
	 * Array with filter-views registered to data-binding.
	 */
	bindedFilterViews : null,

	/**
	 * Should apply a default selection on store load ?
	 */
	afterStoreLoadDoDefaultSelection : true,

	/**
	 * Local reference to the data-source store.
	 */
	store : null,

	dcContext : null,
	_trl_ : null,

	store : null,

	constructor : function(config) {
		config = config || {};
		Ext.apply(this, config);
		this.children = [];
		this.selectedRecords = [];
		this.dsName = this.recordModel.substring( this.recordModel.lastIndexOf('.')+1 ,this.recordModel.length);	
		this.store = Ext.create("Ext.data.Store", {
			model : this.recordModel,
			remoteSort : true,
			remoteSort : true,

			autoLoad : false,
			autoSync : false,
			clearOnPageLoad : true,
			pageSize : this.tuning.fetchSize,
			proxy : {
				type : 'ajax',
				api : Dnet.dsAPI(this.dsName, "json"),
				model : this.recordModel,
				extraParams: {
					params: {}
				},
				actionMethods : {
					create : 'POST',
					read : 'POST',
					update : 'POST',
					destroy : 'POST'
				},
				reader : {
					type : 'json',
					root : 'data',
					idProperty : 'id',
					totalProperty : 'totalCount',
					messageProperty : 'message'
				},
				writer : {
					type : 'json',
					encode : true,
					root: "data",
					allowSingle : false,
					writeAllFields : true
				},
				listeners : {
					"exception" : {
						fn : this.proxyException,
						scope : this
					}
				},
				startParam : Dnet.requestParam.START,
				limitParam : Dnet.requestParam.SIZE,
				sortParam : Dnet.requestParam.ORDERBY
				//directionParam : Dnet.requestParam.SENSE

			}

		});

		this.addEvents(
		/**
		 * Record instance changed
		 */
		"recordChange",

		/**
		 * Data-control status status changed: record state change: clean /
		 * dirty record status change: new record / persisted
		 * 
		 * "statusChange",
		 */

		/**
		 * Selected records changed
		 */
		"selectionChange");

		this.mixins.observable.constructor.call(this);
		this._setup_();
	},

	_setup_ : function() {
		 
		this._trl_ = Ext.create(this.recordModel +"$Trl");
		// this.dsName = this.ds.dsName;
 
		if(Ext.isEmpty(this.filterModel)) {
			this.filterModel = this.recordModel;
		}
		this.setFilter(this.newFilterInstance()); // Ext.create(this.recordModel,
													// {})
		this.setParams(Ext.create(this.paramModel, {}));
 

		this.actionNames = dnet.base.DcActionsFactory.actionNames();
		this.commandNames = dnet.base.DcCommandFactory.commandNames();

		this.actions = dnet.base.DcActionsFactory.createActions(this,
				this.actionNames);
		this.commands = dnet.base.DcCommandFactory.createCommands(this,
				this.commandNames.concat(this.actionNames));

		// register listeners

		// if Query action is disabled do not execute it.
		this.store.on("beforeload", function(store, operation, eopts) {
			if (dnet.base.DcActionsStateManager.isQueryDisabled(this)) {
				return false;
			}
		}, this);

		this.store.on("update", function(store, rec, operation, eopts) {			 
			this.fireEvent("statusChange", {
				dc : this
			});
			this.updateActionsState();
		}, this);

		this.store.on("add", function(store, records, index, eopts) {
//			dnet.base.Logger.debug("dnet.base.AbstractDc (" + this.dsName
//					+ ") -> store.on.add event handler");
				 this.updateActionsState();
			}, this);

		this.store.on("remove", function(store, records, index, eopts) {
//			dnet.base.Logger.debug("dnet.base.AbstractDc (" + this.dsName
//					+ ") -> store.on.remove event handler");
			 this.updateActionsState();
				 this.doDefaultSelection();
			}, this);
		 
		this.store.on("clear", function(store, eopts) { 
			 this.updateActionsState();				
			}, this);
		
		this.store.on("datachanged", function(store, eopts) {
			this.updateActionsState();
		}, this);
		
		// after the store is loaded apply an initial selection
		if (this.afterStoreLoadDoDefaultSelection) {
			this.store.on("load", function(store, records, success, operation, eopts) {
				if (this.afterStoreLoadDoDefaultSelection) {
					this.doDefaultSelection();
				}
			}, this);
		}
		
			 
		
		// invoke the action state update whenever necessary
		this.on("recordChange", this.updateActionsState, this);
		this.on("selectionChange", this.updateActionsState, this);

		// ************************************************
		// to be reviewd
		// ************************************************

		this.store.on("write", function(store, operation, eopts) {
			  
			if(this.record) {				
				this.record = operation.resultSet.records[0];				 				
				if (!this.multiEdit) {
					try {
						this.setSelectedRecords([this.record]);
					}catch(e) {
						//console.log(e);
					}					
				}
			}
			
			this.updateActionsState();
			if (operation.action == "update" || operation.action == "insert") {
				this.afterDoSaveSuccess();
			}
			
			
			}, this);
	},

	/** ***************************************************** */
	/** ***************** Public API ************************ */
	/** ***************************************************** */

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
		this.doRpcFilter(Ext.apply(specs || {}, {
			name : serviceName
		}));
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
	doService : function(serviceName, specs) {
		this.doRpcData(Ext.apply(specs, {
			name : serviceName
		}));
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
		return true; //this.filter.isValid();
	},

	/**
	 * Record validator. It should get interceptor functions chain injected by
	 * the editor forms.
	 */
	isRecordValid : function() {
		return this.record.isValid();
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
		this.fireEvent("updateActionsState", {
			dc : this
		});
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
		if (this.record != null && (this.record.dirty || this.record.phantom)) {
			return true;
		}
		return false;
	},

	/**
	 * Returns true if the store is dirty. Is relevant only if
	 * <code>multiEdit=true</code>
	 */
	isStoreDirty : function() {
		// return this.store.getModifiedRecords().length > 0
		// || this.store.removed.length > 0;
		return this.store.getRemovedRecords().length > 0
				|| this.store.getUpdatedRecords().length > 0
				|| this.store.getAllNewRecords().length > 0;
	},

	/**
	 * Returns true if the data-control is dirty i.e either some the own records
	 * or any child
	 */
	isDirty : function() {
		return this.isCurrentRecordDirty() || 
				this.isStoreDirty()
				|| this.isAnyChildDirty();
	},

	/**
	 * Default initial selection
	 */
	doDefaultSelection : function() {
		if (this.store.getCount() > 0) {
			this.setSelectedRecords( [ this.store.getAt(0) ]);
		} else {
			this.setSelectedRecords( []);
		}
	},

	// --------------------- getters / setters ----------------------



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
				this.fireEvent("parameterValueChanged", this, n, ov, v);
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
				//console.error("DIRTY_DATA_FOUND");
				//console.dir(this.record.data);
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
			var msg = "null";
			if (rec) {
				msg = rec.data.name+ ", dirty = "+rec.dirty; 
			}
			//dnet.base.Logger.debug("dnet.base.AbstractDc.setRecord  => " +msg );
			// this.addToSelectedRecords(rec);
			
			this.fireEvent('recordChange', {
				dc : this,
				newRecord : rec,
				oldRecord : oldrec,
				newIdx : idx,
				status : this.getRecordStatus()
			});
			if (this.selectedRecords.length <= 1 && this.shouldRecordNotifySelection ) {
				if (this.record != null ) {
					this.shouldSelectionNotifyRecord = false;
					this.setSelectedRecords([this.record]);
					this.shouldSelectionNotifyRecord = true;
				} else {
					this.shouldSelectionNotifyRecord = false;
					this.setSelectedRecords([]);
					this.shouldSelectionNotifyRecord = true;
				}				 
			}
		}
	},
	
	shouldRecordNotifySelection: true,
	shouldSelectionNotifyRecord: true,
	
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
		recArray = recArray || [];
		if (!Ext.isArray(recArray)) {
			recArray = [recArray];
		}
		//dnet.base.Logger.debug("dnet.base.AbstractDc.setSelectedRecords length = " 
		//		+recArray.length );
		if (this.selectedRecords != recArray) {
			this.selectedRecords = recArray;
			if (this.shouldSelectionNotifyRecord) {
				if (recArray.length == 0) {
					this.shouldRecordNotifySelection = false;
					this.setRecord(null);
					this.shouldRecordNotifySelection = true;
				} else {
					if ( this.record == null || recArray.length == 1 ) { //||  !Ext.Array.contains(recArray, this.record)
						this.shouldRecordNotifySelection = false;
						this.setRecord(recArray[0]);
						this.shouldRecordNotifySelection = true;
					}
				} 
			}			
			this.fireEvent('selectionChange', {
				dc : this
			});
		}
	},
	
	/**
	 * Return parent data-control
	 */
	getParent : function() {
		return (this.dcContext) ? this.dcContext.parentDc : null;
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
	 * Creates a new record instance and initialize it
	 */
	newRecordInstance : function() {
		var o = Ext.create(this.recordModel, {});
		o.data["clientId"] = getApplication().getSession().client.id;
		return o;
	},

	/**
	 * Creates a new filter instance and initialize it
	 */
	newFilterInstance : function() {
		var o = Ext.create(this.filterModel, {});
		o.data["clientId"] = getApplication().getSession().client.id;
		return o;
	},

	/**
	 * Default proxy-exception handler
	 */
	proxyException : function(proxy, response, operation, eOpts) {
		this.showAjaxErrors(response, eOpts);
	},

	/**
	 * Show errors to user. TODO: Externalize it as command.
	 */
	showAjaxErrors : function(response, options) {
		// Ext.MessageBox.hide();
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
			title : "Server message",	
			msg : msg,
			scope : this,
			icon : Ext.MessageBox.ERROR,
			buttons : Ext.MessageBox.OK
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
		// dc.on("recordChange", this.updateActionsState, this);
	},

	/**
	 * Register a data-control view for data binding management
	 */
//	addBindedView : function(id, type) {
//		if (type == "edit-form") {
//			this.addBindedFormView(id);
//		}
//		if (type == "filter-form") {
//			this.addBindedFilterView(id);
//		}
//	},

	/**
	 * Register a data-control form-view for data binding.
	 */
//	addBindedFormView : function(id) {
//		if (this.bindedFormViews == null) {
//			this.bindedFormViews = [];
//		}
//		this.bindedFormViews[this.bindedFormViews.length] = id;
//
//		this.on('recordChange', function(evnt) {
//			var newRecord = evnt.newRecord;
//			var oldRecord = evnt.oldRecord;
//			var newIdx = evnt.newIdx;
//			if (newRecord) {
//				Ext.BindMgr.unbind(oldRecord);
//				Ext.BindMgr.bind(newRecord, this.bindedFormViews);
//			} else {
//				Ext.BindMgr.unbind(oldRecord);
//			}
//		}, this);
//
//	},

	/**
	 * Register a data-control filter-form view for data binding.
	 */
//	addBindedFilterView : function(id) {
//		if (this.bindedFilterViews == null) {
//			this.bindedFilterViews = [];
//		}
//		this.bindedFilterViews[this.bindedFilterViews.length] = id;
//
//		this.on('filterChanged', function(evnt) {
//			var newFilter = evnt.newFilter;
//			var oldFilter = evnt.oldFilter;
//			if (newFilter) {
//				Ext.BindMgr.unbind(oldFilter);
//				Ext.BindMgr.bind(newFilter, this.bindedFilterViews);
//			} else {
//				Ext.BindMgr.unbind(oldFilter);
//			}
//		}, this);
//	},

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
			Ext.Msg.wait('Working...');
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
				this.afterDoQuerySuccess();
			}
			if (o.action == "doSave") {
				this.afterDoSaveSuccess();
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
