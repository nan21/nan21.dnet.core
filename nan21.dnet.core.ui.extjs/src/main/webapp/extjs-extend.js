//session_decimalSeparator = ".";
//session_groupSeparator = ",";
//
//Ext.DATE_FORMAT = 'd.m.Y';
//Ext.TIME_FORMAT = 'H:i';
//Ext.DATETIME_FORMAT = 'd.m.Y H:i';
//// Ext.MONTH_FORMAT = 'm.Y';
//Ext.form.field.Date.prototype.altFormats = "j|j.n|d|d.m";
//// //Ext.form.field.TimeField.prototype.altFormats = "G|H|G:i";
////
//// Ext.NUMBER_FORMAT_DEC = "0,000.00";
//// Ext.NUMBER_FORMAT_INT = "0,000";
////
////
//Ext.MODEL_DATE_FORMAT = "Y-m-d\\TH:i:s";


Ext.override(Ext.form.field.Base, {
	_setRawValue_: function(v) {		
		this.setRawValue(v);
	} 

});

Ext.override(Ext.form.field.Text, { 
	getRawValue: function() {
		var me = this,
            v = me.callParent();
        if (v === me.emptyText) {
            v = '';
        }
        if (this.caseRestriction && v!= '' ) {
        	if ( this.caseRestriction == "uppercase") {
        		v = v.toUpperCase();
        	} else {
        		v = v.toLowerCase();
        	}
        }
        me.rawValue = v;
        return v; 
    }
});



Ext.override(Ext.form.field.Date, {
	_setRawValue_: function(v) {
		this.setRawValue(this.valueToRaw(v));
	}
});

Ext.override(Ext.data.Store, {

	commitChanges : function() {
		Ext.each(this.getUpdatedRecords(), function(rec) {
			rec.commit();
		});

		Ext.each(this.getNewRecords(), function(rec) {
			rec.commit();
			//rec.phantom = false;
		});

		this.removed = [];
	}, // commitChanges

	rejectChanges : function() {
		this.suspendEvents(false);
		var rLength = this.removed.length;
		for ( var i = 0; i < rLength; i++) {
			this.insert(this.removed[i].lastIndex || 0, this.removed[i]);
		}

		this.remove(this.getAllNewRecords());

		this.each(function(rec) {
			rec.reject();
		});

		this.removed = [];
		this.resumeEvents();
		this.fireEvent('datachanged', this);
	} ,
	
	filterAllNew: function(item) {        
        return item.phantom === true;
    },
    
    getAllNewRecords: function() {
        return this.data.filterBy(this.filterAllNew).items;
    } 

}); // Ext.data.Store




Ext.override(Ext.grid.plugin.CellEditing, {
	 startEdit: function(record, columnHeader) {
	    var me = this,
	        value = record.get(columnHeader.dataIndex),
	        context = me.getEditingContext(record, columnHeader),
	        ed;
	
	    record = context.record;
	    columnHeader = context.column;
	
	    // Complete the edit now, before getting the editor's target
	    // cell DOM element. Completing the edit causes a view refresh.
	    me.completeEdit();
	
	    context.originalValue = context.value = value;
	    if (me.beforeEdit(context) === false || me.fireEvent('beforeedit', context) === false || context.cancel) {
	        return false;
	    }
	    
	    // See if the field is editable for the requested record
	    if (columnHeader && !columnHeader.getEditor(record)) {
	        return false;
	    }
	    
	    ed = me.getCustomEditor(record, columnHeader);
	    if (ed) {
	        me.context = context;
	        me.setActiveEditor(ed);
	        me.setActiveRecord(record);
	        ed.field["_targetRecord_"] = record;
	        me.setActiveColumn(columnHeader);
	
	        // Defer, so we have some time between view scroll to sync up the editor
	        me.editTask.delay(15, ed.startEdit, ed, [me.getCell(record, columnHeader), value]);
	    } else {
	        // BrowserBug: WebKit & IE refuse to focus the element, rather
	        // it will focus it and then immediately focus the body. This
	        // temporary hack works for Webkit and IE6. IE7 and 8 are still
	        // broken
	        me.grid.getView().getEl(columnHeader).focus((Ext.isWebKit || Ext.isIE) ? 10 : false);
	    }
	},
	
	getCustomEditor: function(record, column) {
		var me = this;
		if (me.grid._getCustomCellEditor_) {
			var editor = me.grid._getCustomCellEditor_(record, column);
			if (editor != null ) {
				
				 if (!(editor instanceof Ext.grid.CellEditor)) {
					 editorId = column.id + record.id;
		                editor = Ext.create('Ext.grid.CellEditor', {
		                    editorId: editorId,
		                    field: editor
		                });
		            }
		            editor.parentEl = me.grid.getEditorParent();
		            // editor.parentEl should be set here.
		            editor.on({
		                scope: me,
		                specialkey: me.onSpecialKey,
		                complete: me.onEditComplete,
		                canceledit: me.cancelEdit
		            });
		            //editors.add(editor);
		            return editor;
			} 
			
		} 
		
		return this.getEditor(record, column);
		 
			
	}
	
	
});




 