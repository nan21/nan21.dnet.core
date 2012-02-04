Ext.define("dnet.core.dc.AbstractDcvGrid", {
	extend : "Ext.grid.Panel",

	// DNet properties

	/**
	 * Component builder
	 * @type dnet.core.dc.DcvGridBuilder
	 */
	_builder_ : null,
	
	/**
	 * Columns definition map
	 * @type Ext.util.MixedCollection
	 */
	_columns_ : null,
	/**
	 * Elements definition map
	 * @type Ext.util.MixedCollection
	 */
	_elems_ : null,
	
	/**
	 * DC-Controller
	 * @type dnet.core.dc.AbstractDc
	 */
	_controller_ : null,

	_noSort_	: false,
	_noExport_ : false,
	_noImport_ : true,
	_noLayoutCfg_ : true,
	_exportWindow_ : null,
	_importWindow_ : null,
	_layoutWindow_ : null,
	_routeSelectionTask_ : null,

	// defaults

	buttonAlign : "left",
	//invalidateScrollerOnRefresh: true,
	//invalidateScrollerOnRefresh: false,
	forceFit : false,
	autoScroll:true,
	scroll: "both",
	loadMask : true,
	stripeRows : true,
	border : true,
	frame : true,
	deferRowRender : true,
	//enableLocking : true,
	viewConfig : {
		//invalidateScrollerOnRefresh: false,
		//onStoreLoad: Ext.emptyFn,
		emptyText : Dnet.translate("msg", "grid_emptytext")
	},

	initComponent : function(config) {

		this._elems_ = new Ext.util.MixedCollection();
		this._columns_ = new Ext.util.MixedCollection();

		this._noImport_ = true;
		this._noLayoutCfg_ = true;

		this._startDefine_();
		this._defineDefaultElements_();

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

		this._routeSelectionTask_ = new Ext.util.DelayedTask(
				function() {
					this._controller_.setSelectedRecords(this.getSelectionModel().getSelection());
				}, this);

		var cfg = {
			columns : this._columns_.getRange(),

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
					},
					"beforedeselect" : {
						scope : this,
						fn : function(sm, record, index, eopts) {
							if (record == this._controller_.record
									&& !this._controller_
											.isRecordChangeAllowed()) {
								return false;
							}
						}
					}
				}
			},
			store : this._controller_.store,
			listeners : {
				"itemdblclick" : {
					scope : this,
					fn : function(view, model, item, idx, evnt, evntOpts) {
						this._controller_.onEdit();
					}
				}
			}

		// ,keys:[{
		// key: Ext.EventObject.ENTER,
		// fn: function() {
		// this._controller_.onEdit();
		// },
		// scope: this
		// }]
		};

		var bbitems = [];
		if (!this._noLayoutCfg_) {
			bbitems = [ "-", this._elems_.get("_btnLayout_") ];
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
			if (this._noImport_) {
				bbitems.push("-");
			}			
			bbitems.push(this._elems_.get("_btnExport_"));	
		}

		if (bbitems.length > 0) {
			cfg["bbar"]["items"] = bbitems;
		}

		Ext.apply(cfg, config);
		Ext.apply(this, cfg);

		this.callParent(arguments);

		this.mon(this._controller_.store, "load", this._onStoreLoad_, this);
		this.mon(this._controller_, "selectionChange", this.onController_selectionChange, this);
		
		 
	},
	
	// *********** event handlers ************************
	
	
	onController_selectionChange: function(evnt) { // return ;
		
		var s = evnt.dc.getSelectedRecords();
		//console.log("Abstractdcvgrid. onController_selectionChange sel.len = " + s.length );
		if (s != this.getSelectionModel().getSelection()) {
			this.getSelectionModel().suspendEvents();
			this.getSelectionModel().select(s, false);
			this.getSelectionModel().resumeEvents();
		}
	},
	 
	
	_onStoreLoad_ : function(store, operation, eopts) {
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
	 
	 
	// ****************  API   *****************
	
	_getElement_ : function(name) {
		return Ext.getCmp(this._elems_.get(name).id);
	},
	
	
	_getElementConfig_ : function(name) {
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

	_doImport_ : function() {
		if (this._importWindow_ == null) {
			this._importWindow_ = new dnet.core.dc.DataImportWindow( {});
			this._importWindow_._grid_ = this;
		}
		this._importWindow_.show();
	},

	_doExport_ : function() {
		if (this._exportWindow_ == null) {
			this._exportWindow_ = new dnet.core.dc.DataExportWindow( {
				_grid_ : this
			});
		}
		this._exportWindow_.show();
	},

	_doSort_ : function() {
		//if (this._sortWindow_ == null) {
			this._sortWindow_ = new dnet.core.dc.DataSortWindow({_grid_: this});			 
		//}
		this._sortWindow_.show();
	},
	
	_doLayoutManager_ : function() {
		if (this._layoutWindow_ == null) {
			this._layoutWindow_ = new dnet.core.dc.GridLayoutManager( {
				_grid_ : this
			});
		}
		this._layoutWindow_.show();
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
			this._builder_ = new dnet.core.dc.DcvGridBuilder( {
				dcv : this
			});
		}
		return this._builder_;
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
		this._elems_.add("_btnSort_", {
			xtype : "button",
			id : Ext.id(),			 
			//text : Dnet.translate("dcvgrid", "sort_btn"),
			tooltip : Dnet.translate("dcvgrid", "sort_title"),
			iconCls : 'icon-action-sort',
			handler : this._doSort_,
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
	
	beforeDestroy: function() {
		this._controller_ = null;
		this.callParent(); 
	}

});