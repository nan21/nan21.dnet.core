/**
 * Base grid used for data-control list views.
 */
Ext.define("dnet.core.dc.AbstractDNetDcGrid", {
	extend : "Ext.grid.Panel",

	mixins : {
		factoryElems : "dnet.core.base.AbstractDNetView"
	},

	// **************** Properties *****************

 
			
	/**
	 * 
	 * @type dnet.core.dc.AbstractDc
	 */
	_controller_ : null,

	/**
	 * Columns definition map
	 * 
	 * @type Ext.util.MixedCollection
	 */
	_columns_ : null,

	/**
	 * Flag to switch on/off advanced sort on multiple columns.
	 * 
	 * @type Boolean
	 */
	_noSort_ : false,

	/**
	 * Flag to switch on/off data export.
	 * 
	 * @type Boolean
	 */
	_noExport_ : false,

	/**
	 * Flag to switch on/off data import.
	 * 
	 * @type Boolean
	 */
	_noImport_ : true,

	/**
	 * Flag to switch on/off custom layout management.
	 * 
	 * @type Boolean
	 */
	_noLayoutCfg_ : false,

	/**
	 * Flag to switch on/off paging toolbar
	 * @type Boolean
	 */
	_noPaginator_: false,
	
	/**
	 * Data export window.
	 * 
	 * @type dnet.core.dc.DataExportWindow
	 */
	_exportWindow_ : null,

	/**
	 * Data import window.
	 * 
	 * @type dnet.core.dc.DataExportWindow
	 */
	_importWindow_ : null,

	/**
	 * Custom views management window.
	 * 
	 * @type dnet.core.dc.DataExportWindow
	 */
	_layoutWindow_ : null,

	/**
	 * Delayed task to handle the user initiated records selection in grid and
	 * synchronize the data-control selectedRecords in
	 * 
	 * @link dnet.core.dc.AbstractDc.
	 * 
	 * @type Ext.util.DelayedTask
	 */
	_routeSelectionTask_ : null,

	// **************** Public API *****************

	_defineColumns_ : function() {
	},

	_beforeDefineColumns_ : function() {
		return true;
	},

	_afterDefineColumns_ : function() {
	},

	/**
	 * Open the data-import window
	 */
	_doImport_ : function() {
		if (this._importWindow_ == null) {
			this._importWindow_ = new dnet.core.dc.DataImportWindow({});
			this._importWindow_._grid_ = this;
		}
		this._importWindow_.show();
	},

	/**
	 * Open the data-export window
	 */
	_doExport_ : function() {
		if (this._exportWindow_ == null) {
			this._exportWindow_ = new dnet.core.dc.DataExportWindow({
						_grid_ : this
					});
		}
		this._exportWindow_.show();
	},

	/**
	 * Show the advanced sort window
	 */
	_doSort_ : function() {
		// if (this._sortWindow_ == null) {
		this._sortWindow_ = new dnet.core.dc.DataSortWindow({
					_grid_ : this
				});
		// }
		this._sortWindow_.show();
	},

	/**
	 * Show the custom views management window
	 */
	_doLayoutManager_ : function() {
		if (this._layoutWindow_ == null) {
			this._layoutWindow_ = new dnet.core.dc.GridLayoutManager({
						_grid_ : this
					});
		}
		this._layoutWindow_.show();
	},

	// **************** Defaults and overrides *****************
 
	buttonAlign : "left",
	forceFit : false,
	autoScroll : false,
	scroll : "both",
	loadMask : true,
	stripeRows : true,
	border : true,
	frame : true,
	deferRowRender : true,
	// enableLocking : true,
	viewConfig : {
		emptyText : Dnet.translate("msg", "grid_emptytext")
	},

	/**
	 * Redirect the default state management to our implementation.
	 * 
	 * @return {}
	 */
	getState : function() {
		return this._getViewState_();
	},

	/**
	 * Redirect the default state management to our implementation.
	 * 
	 * @return {}
	 */
	applyState : function(state) {
		return this._applyViewState_(state);
	},

	// **************** Private methods *****************

	_initDcGrid_ : function() {

		// currently disabled until is finalized
		this._noImport_ = true;

		this._elems_ = new Ext.util.MixedCollection();
		this._columns_ = new Ext.util.MixedCollection();

		this._defineDefaultElements_();

		this._startDefine_();

		if (this._beforeDefineColumns_() !== false) {
			this._defineColumns_();
			this._afterDefineColumns_();
		}

		if (this._beforeDefineElements_() !== false) {
			this._defineElements_();
			this._afterDefineElements_();
		}

		this._columns_.each(this._postProcessColumn_, this);
		this._endDefine_();

		/*
		 * disable default selection handler in controller let it be triggered
		 * from here
		 */
		this._controller_.afterStoreLoadDoDefaultSelection = false;

	},

	/**
	 * Create the grid configuration object with the usual properties which are
	 * likely to be required by any subclass
	 * 
	 * @return {Object}
	 */
	_createDefaultGridConfig_ : function() {
		var cfg = {
			store : this._controller_.store,
			columns : this._columns_.getRange()
		};

		if (!this._noPaginator_) {
			cfg.bbar = {
				xtype : "pagingtoolbar",
				store : this._controller_.store,
				displayInfo : true
			}
			var bbitems = [];
			this._buildToolbox_(bbitems);

			if (bbitems.length > 0) {
				cfg["bbar"]["items"] = bbitems;
			}
		} else {
			this._noExport_ = true;
			this._noImport_ = true;
			this._noSort_ = true;
			this._noLayoutCfg_ = true;

		}
		return cfg;
	},

	/**
	 * Register event listeners
	 */
	_registerListeners_ : function() {
		this.mon(this._controller_.store, "load", this._onStore_load_, this);
		this.mon(this._controller_, "selectionChange",  // selectionChange
				this._onController_selectionChange, this );
	},

	/**
	 * Handler for the data-control selectionChange event.
	 * 
	 * @param {}
	 *            evnt
	 */
	_onController_selectionChange : function(evnt) {
		var s = evnt.dc.getSelectedRecords();
		// console.log("Abstractdcvgrid. onController_selectionChange sel.len =
		// " + s.length );
		if ( evnt.eOpts && evnt.eOpts.fromGrid === true ) {
			return;			
		}
		if (s !== this.getSelectionModel().getSelection()) {
			this.getSelectionModel().suspendEvents();
			this.getSelectionModel().select(s, false);
			this.getSelectionModel().resumeEvents();
		}
	},

	/**
	 * Handler for the data-control's store load event.
	 * 
	 * @param {}
	 *            store
	 * @param {}
	 *            operation
	 * @param {}
	 *            eopts
	 */
	_onStore_load_ : function(store, operation, eopts) {
		if (!this._noExport_) {
			if (store.getCount() > 0) {
				this._get_("_btnExport_").enable();
			} else {
				this._get_("_btnExport_").disable();
			}
		}
		if (store.getCount() > 0) {			 
			if (this.selModel.getCount() == 0) {
				this.selModel.select(0);
			} else {
				this._controller_.setSelectedRecords(this.selModel
						.getSelection());
			}
		}
	},

	/**
	 * @private Build default tools
	 * @param {Array}
	 *            bbitems
	 */
	_buildToolbox_ : function(bbitems) {
		if (!this._noLayoutCfg_) {
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnLayout_"));
		}

		if (!this._noSort_) {
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnSort_"));
		}

		if (!this._noImport_) {
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnImport_"));
		}

		if (!this._noExport_) {
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnExport_"));
		}
	},

	/**
	 * Define defaults elements
	 */
	_defineDefaultElements_ : function() {
		this._elems_.add("_btnExport_", {
					xtype : "button",
					id : Ext.id(),
					disabled : true,
					// text : Dnet.translate("dcvgrid", "exp_btn"),
					tooltip : Dnet.translate("dcvgrid", "exp_title"),
					iconCls : 'icon-action-export',
					handler : this._doExport_,
					scope : this
				});
		this._elems_.add("_btnImport_", {
					xtype : "button",
					id : Ext.id(),
					// text : Dnet.translate("dcvgrid", "imp_btn"),
					tooltip : Dnet.translate("dcvgrid", "imp_title"),
					iconCls : 'icon-action-import',
					handler : this._doImport_,
					scope : this
				});
		this._elems_.add("_btnSort_", {
					xtype : "button",
					id : Ext.id(),
					// text : Dnet.translate("dcvgrid", "sort_btn"),
					tooltip : Dnet.translate("dcvgrid", "sort_title"),
					iconCls : 'icon-action-sort',
					handler : this._doSort_,
					scope : this
				});
		this._elems_.add("_btnLayout_", {
					xtype : "button",
					id : Ext.id(),
					// text : Dnet.translate("dcvgrid", "btn_perspective_txt"),
					tooltip : Dnet.translate("dcvgrid", "btn_perspective_tlp"),
					iconCls : 'icon-action-customlayout',
					handler : this._doLayoutManager_,
					scope : this
				});
	},

	/**
	 * Specific implementation to read the grid columns view-state to be stored
	 * as a custom view.
	 * 
	 * @return {}
	 */
	_getViewState_ : function() {
		var me = this, state = null, colStates = [], cm = this.headerCt, cols = cm.items.items;
		for (var i = 0, len = cols.length; i < len; i++) {
			var c = cols[i];
			colStates.push({
						n : c.name,
						h : c.hidden,
						w : c.width
					});
		}
		state = me.addPropertyToState(state, 'columns', colStates);
		return state;
	},

	/**
	 * Apply a view-state read by _getViewState_
	 * 
	 * @param {}
	 *            state
	 */
	_applyViewState_ : function(state) {
		if (!this.rendered) {
			this.on("afterrender", this._applyViewStateAfterRender_, this, {
						single : true,
						state : state
					});
			return;
		}
		var sCols = state.columns, cm = this.headerCt, cols = cm.items.items, col = null;

		for (var i = 0, slen = sCols.length; i < slen; i++) {
			var sCol = sCols[i];
			var colIndex = -1;

			for (var j = 0, len = cols.length; j < len; j++) {
				if (cols[j].name == sCol.n) { // && (!myCM.config[i]._aSel_)
					// ){
					colIndex = j;
					col = cols[j];
					break;
				}
			}

			if (colIndex >= 0) {
				if (sCol.h) {
					col.hide();
				} else {
					col.show();
				}
				col.setWidth(sCol.w);
				// cm.setColumnWidth(colIndex, s.width, true);
				// cm.setColumnHeader(colIndex, s.header, true);
				if (colIndex != i) {
					col.move(colIndex, i);
				}
			}
		}
	},

	_applyViewStateAfterRender_ : function(cmp, eOpts) {
		this._applyViewState_(eOpts.state);
	},

	_selectionHandler_: function(sm, selected, options) {
		var gridSel = this.getSelectionModel().getSelection();
		var dcSel = this._controller_.selectedRecords;
	 
		var ctrl = this._controller_;
		ctrl.setSelectedRecords(gridSel, {fromGrid: true});
		if (gridSel.length <= 1) {
			if (gridSel.length == 1) {
				ctrl.setRecord(gridSel[0],{fromGrid: true});
			} else {
				ctrl.setRecord(null,{fromGrid: true});
			}
		}
		if (gridSel.length > 1) {
			if (ctrl.record == null || gridSel.indexOf(ctrl.record) < 0) {
				ctrl.setRecord(gridSel[0],{fromGrid: true});
			}
		}
	},
				
	/**
	 * Get the selection task. If it doesn't exist yet attempts to create it.
	 * 
	 * @return {}
	 */
	_getRouteSelectionTask_ : function() {
		if (this._routeSelectionTask_ == null) {
			this._routeSelectionTask_ = new Ext.util.DelayedTask(function() {

				var gridSel = this.getSelectionModel().getSelection();
				var dcSel = this._controller_.selectedRecords;
 
				var ctrl = this._controller_;
				ctrl.setSelectedRecords(gridSel, {fromGrid: true});
				if (gridSel.length <= 1) {
					if (gridSel.length == 1) {
						ctrl.setRecord(gridSel[0],{fromGrid: true});
					} else {
						ctrl.setRecord(null,{fromGrid: true});
					}
				}
				if (gridSel.length > 1) {
					if (ctrl.record == null || gridSel.indexOf(ctrl.record) < 0) {
						ctrl.setRecord(gridSel[0],{fromGrid: true});
					}
				}
			}, this);
		}
		return this._routeSelectionTask_;
	},

	/**
	 * Postprocessor run to inject framework specific settings into the columns.
	 * 
	 * @param {Object}
	 *            column Column's configuration object
	 * @param {Integer}
	 *            idx The index
	 * @param {Integer}
	 *            len Total length
	 */
	_postProcessColumn_ : function(column, idx, len) {
		if (column.header == undefined) {
			Dnet.translateColumn(this._trl_, this._controller_._trl_, column);
		}
	},

	/**
	 * Get the translation from the resource bundle for the specified key.
	 * 
	 * @param {String}
	 *            k Key to be translated
	 * @return {String} Translation of the key if found otherwise the key
	 *         itself.
	 */
	_getRBValue_ : function(k) {
		if (this._trl_ != null && this._trl_[k]) {
			return this._trl_[k];
		}
		if (this._controller_._trl_ != null && this._controller_._trl_[k]) {
			return this._controller_._trl_[k];
		} else {
			return k;
		}
	},

	beforeDestroy : function() {
		this._controller_ = null;
		this.callParent();
	}

});