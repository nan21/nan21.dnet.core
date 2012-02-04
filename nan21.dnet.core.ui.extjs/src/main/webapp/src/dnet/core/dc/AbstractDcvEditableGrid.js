

Ext.define("dnet.core.dc.BulkEditWindow", {
	extend : "Ext.window.Window",

	/**
	 * 
	 * @type dnet.core.dc.AbstractDcvGrid
	 */
	_grid_ : null,
	_editorId_ : null,
	
	_editorConfig_ : null,
	_updatableFields_ : null,
	//TODO: optimize this
	
	initComponent : function(config) {
		this._editorId_ = Ext.id();
		this.setupBulkEditor();
		
		var btn = Ext.create('Ext.Button', {
			text : Dnet.translate("dcvgrid", "bulkedit_run"),
			//iconCls : 'icon-action-sort',
			scope: this,
			handler:this.executeTask
		});

		var avlCol = [];
		this._grid_._columns_.each(function(item, idx,len) {
			avlCol[avlCol.length] = [item.name, item.header, '',item.header+'' ]
		})
		 
	    
		var cfg = {
			title : Dnet.translate("dcvgrid", "bulkedit_title"),
			border : true,
			width : 350,
			height:180,
			resizable : true,
			closeAction : "hide",			 
			closable : true,
			constrain : true,
			buttonAlign : "center",
			modal : true,
			layout:"fit",
			items : [this._editorConfig_ ],
			buttons : [ btn ]
		};

		Ext.apply(cfg, config);
		Ext.apply(this, cfg);
		this.callParent(arguments);
	},
	
	
	setupBulkEditor: function() {
		this._updatableFields_ = [];
		var bef = this._grid_._bulkEditFields_;
		if (Ext.isEmpty(bef) || bef.length == 0 ) {
			return null;
		}
		
		var gc = this._grid_._columns_
		 	len = bef.length;
		 	
		 	
		for (var i=0; i<len; i++ ) {
			var name =bef[i];
			var col = gc.get(name);
			this._updatableFields_.push({"name": name, "title": col.header});
		}
		 
		var updFieldsStore = Ext.create('Ext.data.Store', {
		    fields: ['name', 'title'],
		    data : this._updatableFields_
		});
  
		 var be_source = {
		 		_ds_fieldName_ : "",
		 		_ds_fieldValue_ : ""
		 	},
		 	be_props = {
		 		_ds_fieldName_ : "Field",
		 		_ds_fieldValue_ : "New Value"
		 	},
		 	be_editors = {
		 		_ds_fieldName_ : Ext.create('Ext.form.field.ComboBox', {
		 					selectOnFocus:true, 
		 					store: updFieldsStore,
						    queryMode: 'local',
						    displayField: 'title',
						    valueField: 'title'
				})
		 	};
		
		for (var i=0; i<len; i++ ) {
			var name =bef[i];
			var col = gc.get(name);
			be_editors["_ds_fieldValue_"+name] = col.editor;
			//this._updatableFields_.push({"name": name, "title": col.header});
		}
				
		this._editorConfig_ = {			
			xtype: 'bulkeditor',	        
	        id : this._editorId_,
	       // preventHeader: true,
	        _grid_: this._grid_,
	        _updatableFields_ : this._updatableFields_, 
			customEditors: be_editors,		 
		    propertyNames: be_props,
		    source: be_source
		}
	},
	
	
	getEditor : function() {
		return Ext.getCmp(this._editorId_);
	},
	
	
	getField: function(title) {
		var f = this._updatableFields_,
			l = f.length;
		for(var i=0;i<l; i++) {
			if(f[i].title == title ) {
				return f[i].name
			}
		}
	},
	
	
	
	
	
	executeTask : function() {
		var ed = this.getEditor(),
			s = ed.getSource(), 
			dsfield = s._ds_fieldName_
			;
		if ( !Ext.isEmpty(dsfield)) {
			dsfield = this.getField(dsfield);
			var ctrl = this._grid_._controller_
				sel = ctrl.selectedRecords,
				store = ctrl.store,
				sellen = sel.length;
			store.suspendEvents(true);	
			for (var i=0;i<sellen;i++) {
				sel[i].set(dsfield, s._ds_fieldValue_);
				
				for(var p in s) {
					if (p != "_ds_fieldValue_" && p != "_ds_fieldName_") {
						sel[i].set(p, s[p]);
					}
				}
				
				
			}
			store.resumeEvents();
		} 
		this.close();
	}

});




Ext.define("dnet.core.dc.BulkEditor", {
	extend : "Ext.grid.property.Grid",	
	alias:"widget.bulkeditor",
	//title: 'Bulk edit',
    width: 300 ,
    _dcViewType_: "bulk-edit-field",
    _grid_ : null,
   // hideHeaders : true,
    _updatableFields_ : null,
     
    _getEditor_:function(propName) {
    	
    },
    _getField_: function(title) {
		var f = this._updatableFields_,
			l = f.length;
		for(var i=0;i<l; i++) {
			if(f[i].title == title ) {
				return f[i].name
			}
		}
	},
    getCellEditor : function(record, column) {
    	
    	var src = this.getSource();
    	if (record.data.name != "_ds_fieldName_") {    	
	    	if (Ext.isEmpty(src._ds_fieldName_)) {
	    		Ext.Msg.show({
					title : "No field selected",
					msg:"Select first the field to update, then try to set its value.",	
					icon : Ext.MessageBox.INFO,
					buttons : Ext.Msg.OK      
	    		});
	    		return null;
	    	}    		    		
    	}
    	
         var me = this,
            propName = record.get(me.nameField),
            val = record.get(me.valueField),
            editor = me.customEditors[propName]
            dsField = "";

        if (propName == "_ds_fieldName_") {
    		editor = me.customEditors[propName];
    	} else { 
    		dsField = this._getField_(src._ds_fieldName_);
    		editor = me.customEditors[propName+dsField];
    	}    
            
        // A custom editor was found. If not already wrapped with a CellEditor, wrap it, and stash it back
        // If it's not even a Field, just a config object, instantiate it before wrapping it.
        if (editor) {
            if (!(editor instanceof Ext.grid.CellEditor)) {
                if (!(editor instanceof Ext.form.field.Base)) {
                    editor = Ext.ComponentManager.create(editor, 'textfield');
                }
                editor = me.customEditors[propName] = Ext.create('Ext.grid.CellEditor', { field: editor });
            }
        } else if (Ext.isDate(val)) {
            editor = me.editors.date;
        } else if (Ext.isNumber(val)) {
            editor = me.editors.number;
        } else if (Ext.isBoolean(val)) {
            editor = me.editors['boolean'];
        } else {
            editor = me.editors.string;
        }

        // Give the editor a unique ID because the CellEditing plugin caches them
        if (propName == "_ds_fieldName_") {
    		editor.editorId = propName;
    	} else { 
    		editor.editorId = propName+dsField;    	 
    	}  
    	editor.field._dcView_ = this;
        return editor;
    }
});


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

	_noSort_	: false,
	_noBulkEdit_ : false,
	_noExport_ : false,
	_noImport_ : true,
	_noLayoutCfg_ : true,
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
		
		if (!this._noSort_) {			 
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnSort_"));			 
		}
		if (!this._noBulkEdit_ && this._bulkEditFields_ != null && this._bulkEditFields_.length > 0) {			 
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnBulkEdit_"));			 
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
			text : Dnet.translate("dcvgrid", "btn_perspective_txt"),
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
 