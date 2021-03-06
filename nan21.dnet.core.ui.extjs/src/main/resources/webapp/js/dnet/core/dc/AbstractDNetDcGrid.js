/**
 * Base grid used for data-control list views.
 */
Ext.define("dnet.core.dc.AbstractDNetDcGrid", {
	extend : "Ext.grid.Panel",

	mixins : {
		elemBuilder : "dnet.core.base.AbstractDNetView",
		dcViewSupport : "dnet.core.dc.AbstractDNetDcView"
	},

	// **************** Properties *****************

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
	 * Flag to switch on/off advanced filter.
	 * 
	 * @type Boolean
	 */
	_noFilter_ : false,

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
	_noImport_ : false,

	/**
	 * Flag to switch on/off data printing.
	 * 
	 * @type Boolean
	 */
	_noPrint_ : false,

	/**
	 * Flag to switch on/off custom layout management.
	 * 
	 * @type Boolean
	 */
	_noLayoutCfg_ : false,

	/**
	 * Flag to switch on/off paging toolbar
	 * 
	 * @type Boolean
	 */
	_noPaginator_ : false,

	/**
	 * Data export window.
	 * 
	 * @type dnet.core.dc.DataExportWindow
	 */
	_exportWindow_ : null,

	/**
	 * Data print window.
	 * 
	 * @type dnet.core.dc.DataPrintWindow
	 */
	_printWindow_ : null,

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
	 * Title to be used in the dynamically generated reports.
	 */
	_printTitle_ : null,

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
			this._importWindow_ = new dnet.core.base.FileUploadWindow2({
				// _description_ : "Select a CSV file to import its content.",
				_uploadUrl_ : "/nan21.dnet.core.web/upload/ds-csv-import/"
						+ this._controller_.dsName,
				_fields_ : {
					separator : {
						xtype : "combo",
						store : [ ";" ],
						value : ";",
						fieldLabel : "Field separator",
						allowBlank : false,
						labelSeparator : "*"
					},
					quoteChar : {
						xtype : "combo",
						store : [ '"' ],
						value : '"',
						fieldLabel : "Optionally enclosed by",
						allowBlank : false,
						labelSeparator : "*"
					},
					encoding : {
						xtype : "combo",
						store : [ "AUTO", "UTF-8" ],
						value : "UTF-8",
						fieldLabel : "Character encoding",
						allowBlank : false,
						labelSeparator : "*"
					}
				},
				_succesCallbackScope_ : this,
				_succesCallbackFn_ : function() {
					this._controller_.doQuery();
				}
			});
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
	 * Open the data-print window
	 */
	_doPrint_ : function() {
		if (this._printWindow_ == null) {
			this._printWindow_ = new dnet.core.dc.DataPrintWindow({
				_grid_ : this
			});
		}
		this._printWindow_.show();
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
	 * Show the advanced filter window
	 */
	_doFilter_ : function() {
		if (this._sortWindow_ == null) {
			this._filterWindow_ = new dnet.core.dc.DataFilterWindow({
				_grid_ : this
			});
		}
		this._filterWindow_.show();
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
	border : true,
	frame : true,
	deferRowRender : true,
	// enableLocking : true,
	loadMask : {
		msg : 'Loading...'
	},
	viewConfig : {
		loadMask : {
			msg : 'Loading...'
		},
		enableTextSelection : true,
		stripeRows : true,
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

	beforeDestroy : function() {
		// call the contributed helpers from mixins
		this._beforeDestroyDNetDcView_();
		this._beforeDestroyDNetView_();
		this.callParent(arguments);
	},

	// **************** Private methods *****************

	_initDcGrid_ : function() {

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
			this._noPrint_ = true;
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
		this.mon(this._controller_, "selectionChange", // selectionChange
		this._onController_selectionChange, this);
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
		if (evnt.eOpts && evnt.eOpts.fromGrid === true
				&& evnt.eOpts.grid === this) {
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
		if (!this._noPrint_) {
			if (store.getCount() > 0) {
				this._get_("_btnPrint_").enable();
			} else {
				this._get_("_btnPrint_").disable();
			}
		}
		/*
		 * restore the selected records from the controller. Select first if
		 * record from store if controller has no selection or the current store
		 * doesn't contain any of the previous selection
		 */
		if (store.getCount() > 0) {
			var ctrlSel = this._controller_.getSelectedRecords();
			if (ctrlSel.length > 0) {
				var newSel = [];
				for(var i=0,l=ctrlSel.length;i<l;i++) {
					var r = store.getById(ctrlSel[i].get(ctrlSel[i].idProperty));
					if (r != null) {
						newSel[newSel.length] = r;
					}
				}
				if (newSel.length > 0) {
					this._controller_.setSelectedRecords(newSel);
				} else {
					this.selModel.select(0);
				}				
			} else {
				this.selModel.select(0);
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
		if (!this._noFilter_) {
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnFilter_"));
		}
		if (!this._noImport_) {
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnImport_"));
		}

		if (!this._noExport_) {
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnExport_"));
		}

		if (!this._noPrint_) {
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnPrint_"));
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
			tooltip : Dnet.translate("dcvgrid", "exp_title"),
			iconCls : 'icon-action-export',
			handler : this._doExport_,
			scope : this
		});
		this._elems_.add("_btnPrint_", {
			xtype : "button",
			id : Ext.id(),
			disabled : true,
			tooltip : Dnet.translate("dcvgrid", "print_title"),
			iconCls : 'icon-action-print',
			handler : this._doPrint_,
			scope : this
		});
		this._elems_.add("_btnImport_", {
			xtype : "button",
			id : Ext.id(),
			tooltip : Dnet.translate("dcvgrid", "imp_title"),
			iconCls : 'icon-action-import',
			handler : this._doImport_,
			scope : this
		});
		this._elems_.add("_btnSort_", {
			xtype : "button",
			id : Ext.id(),
			tooltip : Dnet.translate("dcvgrid", "sort_title"),
			iconCls : 'icon-action-sort',
			handler : this._doSort_,
			scope : this
		});
		this._elems_.add("_btnFilter_", {
			xtype : "button",
			id : Ext.id(),
			tooltip : Dnet.translate("dcvgrid", "filter_title"),
			iconCls : 'icon-action-filter',
			handler : this._doFilter_,
			scope : this
		});
		this._elems_.add("_btnLayout_", {
			xtype : "button",
			id : Ext.id(),
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
		var me = this;
		var state = null;
		var colStates = [];
		var cm = this.headerCt;
		var cols = cm.items.items;

		for ( var i = 0, len = cols.length; i < len; i++) {
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

		var sCols = state.columns;
		var cm = this.headerCt;
		var cols = cm.items.items;
		var col = null;

		for ( var i = 0, slen = sCols.length; i < slen; i++) {
			var sCol = sCols[i];
			var colIndex = -1;

			for ( var j = 0, len = cols.length; j < len; j++) {
				if (cols[j].name == sCol.n) {
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
				if (colIndex != i) {
					col.move(colIndex, i);
				}
			}
		}
	},

	_applyViewStateAfterRender_ : function(cmp, eOpts) {
		this._applyViewState_(eOpts.state);
	},

	_selectionHandler_ : function(sm, selected, options) {
		var gridSel = this.getSelectionModel().getSelection();
		var dcSel = this._controller_.selectedRecords;

		var ctrl = this._controller_;
		ctrl.setSelectedRecords(gridSel, {
			fromGrid : true,
			grid : this
		});
		if (gridSel.length <= 1) {
			if (gridSel.length == 1) {
				ctrl.setRecord(gridSel[0], {
					fromGrid : true,
					grid : this
				});
			} else {
				ctrl.setRecord(null, {
					fromGrid : true,
					grid : this
				});
			}
		}
		if (gridSel.length > 1) {
			if (ctrl.record == null || gridSel.indexOf(ctrl.record) < 0) {
				ctrl.setRecord(gridSel[0], {
					fromGrid : true,
					grid : this
				});
			}
		}
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
	}

});