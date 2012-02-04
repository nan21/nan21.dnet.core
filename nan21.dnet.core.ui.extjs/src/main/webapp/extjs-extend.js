
Ext.override(Ext.data.Model, { 
	clientIdProperty:"__clientRecordId__"
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
  
	filterAllNew: function(item) {        
        return item.phantom === true;
    },
    
    getAllNewRecords: function() {
        return this.data.filterBy(this.filterAllNew).items;
    },
    
    filterUpdated: function(item) {        
        return item.dirty === true && item.phantom !== true ;  
    },
    getModifiedRecords : function(){
		return [].concat(this.getAllNewRecords(), this.getUpdatedRecords());
	}
}); 


 
Ext.override(Ext.grid.plugin.CellEditing, {
 
	getEditor: function(record, column) {
        var me = this;
		if (me.grid._getCustomCellEditor_) {
			var editor = me.grid._getCustomCellEditor_(record, column);
			if (editor != null ) {
				 
				if (!(editor instanceof Ext.grid.CellEditor)) {
					editorId = column.id + record.id;
	                editor = new Ext.grid.CellEditor({
	                    editorId: editorId,
	                    field: editor,
	                    editingPlugin: me,
	                    ownerCt: me.grid
	                });
	            }
	            editor.on({
	                scope: me,
	                specialkey: me.onSpecialKey,
	                complete: me.onEditComplete,
	                canceledit: me.cancelEdit
	            });
	            editor.field["_targetRecord_"] = record;
	           // editors.add(editor);
	            return editor;
 
			} 
			
		}
		var editor = this.callParent(arguments);
		if(editor.field) {
			editor.field["_targetRecord_"] = record;
		}
		return editor;
		 
    }
  
});

 