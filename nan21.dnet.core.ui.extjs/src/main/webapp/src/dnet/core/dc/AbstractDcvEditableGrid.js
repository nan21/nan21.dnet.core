Ext.define("dnet.core.dc.AbstractDcvEditableGrid", {
	extend : "Ext.grid.Panel",

	// DNet properties

	_builder_ : null,
	_columns_ : null,
	_elems_ : null,
	_controller_ : null,

	_noExport_ : false,
	_noImport_ : true,
	_noLayoutCfg_ : true,
	_exportWindow_ : null,
	_importWindow_ : null,
	_layoutWindow_ : null,
	_routeSelectionTask_ : null,

	// defaults

	forceFit : false,
	deferRowRender : true,
	clicksToEdit : 1,
	loadMask : true,
	border : true,
	frame : true,
	stripeRows : true,
	buttonAlign : "left",
	viewConfig : {
		emptyText : Dnet.translate("msg", "grid_emptytext")
	},

	initComponent : function(config) {

		this._elems_ = new Ext.util.MixedCollection();
		this._columns_ = new Ext.util.MixedCollection();

		this._noImport_ = true;
		this._noLayoutCfg_ = true;

		this.plugins = [ Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		}) ];

		this._startDefine_();
		this._defineDefaultElements_();

		/* define columns */
		if (this._beforeDefineColumns_() !== false) {
			this._defineColumns_();
		}
		this._afterDefineColumns_();

		this._columns_.each(this._postProcessColumn_, this);

		this._endDefine_();

		/*
		 * disable default selection handler in controller let it be triggered
		 * from here
		 */
		this._controller_.afterStoreLoadDoDefaultSelection = false;

		this._routeSelectionTask_ = new Ext.util.DelayedTask(function() {
			this._controller_.setSelectedRecords(this.getSelectionModel()
					.getSelection());
		}, this);

		var cfg = {
			columns : this._columns_.getRange()

			// ,keys: [
			// {
			// key : Ext.EventObject.ENTER
			// ,scope:this
			// ,handler: function() {
			// var rec = this.getSelectionModel().getSelected();
			// var rowIndex = this.store.indexOf(rec);
			// var cm = this.getColumnModel();
			// //TODO: find the first editable cell from the column model
			// this.startEditing(rowIndex, 1);
			// }
			// }
			// ]

			,
			bbar : {
				xtype : "pagingtoolbar",
				store : this._controller_.store,
				displayInfo : true
			},
			selModel : {
				mode : "MULTI",
				listeners : {
					"selectionchange" : {
						scope : this,
						fn : function(sm, selected, options) {
							this._routeSelectionTask_.delay(150);
						}
					}
				}
			},
			store : this._controller_.store

		};

		var bbitems = [];
		if (!this._noLayoutCfg_) {
			bbitems = [ "-", this._elems_.get("_btnLayout_") ];
		}

		if (!this._noImport_) {
			if (bbitems.length == 0) {
				bbitems[0] = "-";
			}
			bbitems[bbitems.length] = [ this._elems_.get("_btnImport_") ];
		}
		if (!this._noExport_) {
			if (bbitems.length == 0) {
				bbitems[0] = "-";
			}
			bbitems[bbitems.length] = [ this._elems_.get("_btnExport_") ];
		}

		if (bbitems.length > 0) {
			cfg["bbar"]["items"] = bbitems;
		}

		Ext.apply(cfg, config);
		Ext.apply(this, cfg);

		this.callParent(arguments);

		this.mon(this._controller_.store, "load", this._onStoreLoad_, this);
		this.on("afteredit", this._afterEdit_, this);
		this.mon(this._controller_, "selectionChange", this.onController_selectionChange, this);

	},
	
	onController_selectionChange: function(evnt) {
		var s = evnt.dc.getSelectedRecords();
		if (s != this.getSelectionModel().getSelection()) {
			this.getSelectionModel().suspendEvents();
			this.getSelectionModel().select(s, false);
			this.getSelectionModel().resumeEvents();
		}
	},
	
	_getElement_ : function(name) {
		return Ext.getCmp(this._elems_.get(name).id);
	},
	
	_getElementConfig_ : function(name) {
		return this._elems_.get(name);
	},
	
	_get_ : function(name) {
		return this._getElement_(name);
	},
	_getConfig_ : function(name) {
		return this._elems_.get(name);
	},
	
	_startDefine_ : function() {
	},
	
	_endDefine_ : function() {
	},

	_defineColumns_ : function() {
	},

	_beforeDefineColumns_ : function() {
		return true;
	},

	_afterDefineColumns_ : function() {
	},

	_defineElements_ : function() {
	},

	_beforeDefineElements_ : function() {
		return true;
	},
	_afterDefineElements_ : function() {
	},

	_defineDefaultElements_ : function() {
		this._elems_.add("_btnExport_", {
			xtype : "button",
			id : Ext.id(),
			disabled : true,
			text : Dnet.translate("dcvgrid", "exp_btn"),
			tooltip : Dnet.translate("dcvgrid", "exp_title"),
			iconCls : 'icon-action-export',
			handler : this._doExport_,
			scope : this
		});
		this._elems_.add("_btnImport_", {
			xtype : "button",
			id : Ext.id(),
			text : Dnet.translate("dcvgrid", "imp_btn"),
			tooltip : Dnet.translate("dcvgrid", "imp_title"),
			iconCls : 'icon-action-import',
			handler : this._doImport_,
			scope : this
		});
		this._elems_.add("_btnLayout_", {
			xtype : "button",
			id : Ext.id(),
			text : Dnet.translate("dcvgrid", "btn_perspective_txt"),
			tooltip : Dnet.translate("dcvgrid", "btn_perspective_tlp"),
			iconCls : 'icon-action-customlayout',
			handler : this._doLayoutManager_,
			scope : this
		});
	},
	_doImport_ : function() {
		if (this._importWindow_ == null) {
			this._importWindow_ = new dnet.core.base.DataImportWindow();
			this._importWindow_._grid_ = this;
		}
		this._importWindow_.show();
	},
	_doExport_ : function() {
		if (this._exportWindow_ == null) {
			this._exportWindow_ = new dnet.core.base.DataExportWindow({_grid_: this});			 
		}
		this._exportWindow_.show();
	},
	_doLayoutManager_ : function() {
		if (this._layoutWindow_ == null) {
			this._layoutWindow_ = new dnet.core.dc.GridLayoutManager();
			this._layoutWindow_._grid_ = this;
		}
		this._layoutWindow_.show();
	}

	,
	_onStoreLoad_ : function(store, records, options) {
		if (!this._noExport_) {
			if (store.getCount() > 0) {
				this._getElement_("_btnExport_").enable();
			} else {
				this._getElement_("_btnExport_").disable();
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

	_afterEdit_ : function(e) {

	},

	_postProcessColumn_ : function(item, idx, len) {
		if (item.header == undefined) {
			Dnet.translateColumn(this._trl_, this._controller_._trl_, item);
		}
	},

	/* get value from resource bundle for the specified key */
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

	_getBuilder_ : function() {
		if (this._builder_ == null) {
			this._builder_ = new dnet.core.dc.DcvEditableGridBuilder( {
				dcv : this
			});
		}
		return this._builder_;
	},
	
	beforeDestroy: function() {
		this._controller_ = null;
		this.callParent(); 
	}
	
});
 