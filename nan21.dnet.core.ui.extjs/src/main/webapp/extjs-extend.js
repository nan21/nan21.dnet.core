 
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

  
Ext.define("dnet.base.DisplayFieldText", {
	extend: "Ext.form.field.Display",
	alias: "widget.displayfieldtext",
	
	asText: false,
 
	valueToRaw: function(value) {
			return value;      
    }, 
    
    setRawValue: function(value) {
        var me = this;
        value = Ext.value(value, '');
        me.rawValue = value;
        if (me.rendered) {
        	if (this.asText) {
        		me.inputEl.dom.innerHTML = "<pre>" + value + "</pre>";
        	} else {
        		me.inputEl.dom.innerHTML = me.htmlEncode ? Ext.util.Format.htmlEncode(value) : value;
        	}
            
        }
        return value;
    }
});

Ext.define("dnet.base.DisplayFieldDate", {
	extend: "Ext.form.field.Display",
	alias: "widget.displayfielddate",
	valueToRaw: function(value) { 
        return Ext.util.Format.date(value, Dnet.DATE_FORMAT);
    }
});

Ext.define("dnet.base.DisplayFieldNumber", {
	extend: "Ext.form.field.Display",
	alias: "widget.displayfieldnumber",
 
	valueToRaw: function(value) {
        return Ext.util.Format.number(value, this.format || "0");
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
    },
    
    filterUpdated: function(item) {        
        return item.dirty === true && item.phantom !== true ;  
    }
}); 




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
        
        //ed = me.getEditor(record, columnHeader);
        /* my code */
        ed = me.getCustomEditor(record, columnHeader);
        
        if (ed) {
            me.context = context;
            me.setActiveEditor(ed);
            me.setActiveRecord(record);
            /* my code */
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

 