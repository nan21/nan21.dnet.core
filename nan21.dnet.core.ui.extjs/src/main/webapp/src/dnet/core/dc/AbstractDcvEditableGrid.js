Ext.define("dnet.core.dc.AbstractDcvEditableGrid", {
	extend : "Ext.grid.Panel",

	// DNet properties

	/**
	 * Component builder
	 * @type dnet.core.dc.DcvEditableGridBuilder
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

	/**
	 * Flag to switch on/off advanced sort on multiple columns.
	 * @type Boolean
	 */
	_noSort_	: false,
	
	/**
	 * Flag to switch on/off bulk edit feature
	 * @type Boolean
	 */
	_noBulkEdit_ : false,
	
	/**
	 * Flag to switch on/off data export.
	 * @type Boolean
	 */
	_noExport_ : false,
	
	/**
	 * Flag to switch on/off data import.
	 * @type Boolean
	 */
	_noImport_ : false,
	
	/**
	 * Flag to switch on/off custom layout management.
	 * @type Boolean
	 */
	_noLayoutCfg_ : false,
	
	/**
	 * Data export window.
	 * @type dnet.core.dc.DataExportWindow
	 */
	_exportWindow_ : null,
	
	
	_importWindow_ : null,
	_layoutWindow_ : null,
	_routeSelectionTask_ : null,
	_bulkEditFields_:null,
	
	// defaults

	forceFit : false,
	deferRowRender : true,
	clicksToEdit : 1,
	loadMask : true,
	border : true,
	frame : true,
	stripeRows : true,
	buttonAlign : "left",
	//enableLocking : true,
	viewConfig : {
		emptyText : Dnet.translate("msg", "grid_emptytext")
	},

	initComponent : function(config) {

		this._noImport_ = true;
		
		this._elems_ = new Ext.util.MixedCollection();
		this._columns_ = new Ext.util.MixedCollection();
 
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
					}
				}
			},
			store : this._controller_.store

		};

		var bbitems = [];
		this._buildToolbox_(bbitems);

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
	
	
	_buildToolbox_: function(bbitems) {
 
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
		
		if (!this._noBulkEdit_ && this._bulkEditFields_ != null && this._bulkEditFields_.length > 0) {			 
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnBulkEdit_"));			 
		}
		  
	},
	
	getState: function(){        
        return this._getViewState_();
    },
     
    applyState: function(state){        
        return this._applyViewState_(state);
    },
    
    _getViewState_: function(){
        var me = this,
            state = null,
            colStates = [],
            cm = this.headerCt,    	
    		cols = cm.items.items;
        for(var i = 0, len = cols.length; i < len; i++){
        	var c=cols[i];
        	colStates.push({
        		n : c.name,
        		h : c.hidden,
        		w : c.width
        	});
        }
            
        state = me.addPropertyToState(state, 'columns', colStates);
        return state;
    },
    _applyViewStateAfterRender_: function(cmp, eOpts) {
    	this._applyViewState_(eOpts.state);
    },
     _applyViewState_ : function(state) {
     	if (!this.rendered) {
     		this.on("afterrender", this._applyViewStateAfterRender_, this, {single:true, state:state});
     		return ;
     	}
    	var sCols = state.columns, 
    		cm = this.headerCt,    	
    		cols = cm.items.items,
    		col = null;
         
    	for(var i = 0, slen = sCols.length; i < slen; i++){
            var sCol = sCols[i];
            var colIndex = -1;
            
            for (var j = 0, len = cols.length;j < len; j++) {
	            if (cols[j].name == sCol.n ) { //&& (!myCM.config[i]._aSel_) ){	            	 
	                colIndex = j;
	                col = cols[j];
	                break;
	            }
	        }
	        
            if(colIndex >= 0){               
            	if (sCol.h) {
            		col.hide();
            	} else {
            		col.show();
            	}
                 col.setWidth(sCol.w);
                //cm.setColumnWidth(colIndex, s.width, true);
                //cm.setColumnHeader(colIndex, s.header, true);
                if(colIndex != i){
                    col.move(colIndex, i);
                }
            }
        }
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
			//text : Dnet.translate("dcvgrid", "exp_btn"),
			tooltip : Dnet.translate("dcvgrid", "exp_title"),
			iconCls : 'icon-action-export',
			handler : this._doExport_,
			scope : this
		});
		this._elems_.add("_btnImport_", {
			xtype : "button",
			id : Ext.id(),
			//text : Dnet.translate("dcvgrid", "imp_btn"),
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
		this._elems_.add("_btnBulkEdit_", {
			xtype : "button",
			id : Ext.id(),
			//text : Dnet.translate("dcvgrid", "btn_bulkedit"),
			tooltip : Dnet.translate("dcvgrid", "btn_bulkedit_tlp"),
			iconCls : 'icon-action-edit',
			handler : this._doBulkEdit_,
			scope : this
		});
		this._elems_.add("_btnLayout_", {
			xtype : "button",
			id : Ext.id(),
			//text : Dnet.translate("dcvgrid", "btn_perspective_txt"),
			tooltip : Dnet.translate("dcvgrid", "btn_perspective_tlp"),
			iconCls : 'icon-action-customlayout',
			handler : this._doLayoutManager_,
			scope : this
		});
	},
	_doImport_ : function() {
		if (this._importWindow_ == null) {
			this._importWindow_ = new dnet.core.dc.DataImportWindow();
			this._importWindow_._grid_ = this;
		}
		this._importWindow_.show();
	},
	_doExport_ : function() {
		if (this._exportWindow_ == null) {
			this._exportWindow_ = new dnet.core.dc.DataExportWindow({_grid_: this});			 
		}
		this._exportWindow_.show();
	},
	_doBulkEdit_ : function() {
		//if (this._importWindow_ == null) {
		if (this._controller_.selectedRecords.length == 0 ) {
			Ext.Msg.show({
					title : "No records selected",
					msg:"Select the records for which you want to apply the changes.",	
					icon : Ext.MessageBox.INFO,
					buttons : Ext.Msg.OK      
	    		});
			return;
		}
		this.__doBulkEditWindow_ = new dnet.core.dc.BulkEditWindow({_grid_: this });
			 
		//}
		this.__doBulkEditWindow_.show();
	},
	_doLayoutManager_ : function() {
		if (this._layoutWindow_ == null) {
			this._layoutWindow_ = new dnet.core.dc.GridLayoutManager();
			this._layoutWindow_._grid_ = this;
		}
		this._layoutWindow_.show();
	},

	_doSort_ : function() {
		//if (this._sortWindow_ == null) {
			this._sortWindow_ = new dnet.core.dc.DataSortWindow({_grid_: this});			 
		//}
		this._sortWindow_.show();
	},
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
 