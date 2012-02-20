
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
