//
//Ext.override(Ext.form.field.Trigger , {
//
//triggerBlur: function(e) {
//        var me = this;
//        me.mimicing = false;
//        me.mun(me.doc, 'mousedown', me.mimicBlur, me);
//        if (me.monitorTab && me.inputEl) {
//            me.un('specialkey', me.checkTab, me);
//        }
//        Ext.form.field.Trigger.superclass.onBlur.call(me, e);
//        if (me.bodyEl) {
//            me.bodyEl.removeCls(me.wrapFocusCls);
//        }
//    },
//    
//    onFocus: function() {
//        var me = this;
//        me.callParent(arguments);
//        if (!me.mimicing) {
//            me.bodyEl.addCls(me.wrapFocusCls);
//            me.mimicing = true;
//            me.mon(me.doc, 'mousedown', me.mimicBlur, me, {
//                delay: 10
//            });
//            if (me.monitorTab) {
//                me.on('specialkey', me.checkTab, me);
//            }
//        }
//    }
//});

Ext.override(Ext.form.field.Picker, {
	collapse: function() {
		if (this.isExpanded && !this.isDestroyed) {
            var me = this,
                openCls = me.openCls,
                picker = me.picker,
                doc = Ext.getDoc(),
                collapseIf = me.collapseIf,
                aboveSfx = '-above';

            // hide the picker and set isExpanded flag
            picker.hide();
            me.isExpanded = false;

            // remove the openCls
            me.bodyEl.removeCls([openCls, openCls + aboveSfx]);
            picker.el.removeCls(picker.baseCls + aboveSfx);

            // remove event listeners
            doc.un('mousewheel', collapseIf, me);
            doc.un('mousedown', collapseIf, me);
            Ext.EventManager.removeResizeListener(me.alignPicker, me);
            me.fireEvent('collapse', me);
            me.onCollapse();
            this.focus(true);
        }
		
    }
});

Ext.override(Ext.data.Model, {
			clientIdProperty : "__clientRecordId__"
		});

Ext.override(Ext.form.Basic, {
			findField : function(id) {
				return this.getFields().findBy(function(f) {
					return f.dataIndex === id || f.id === id
							|| f.getName() === id;
				});
			}
		});

		
//Ext.override(Ext.form.field.Base, {
//	nextFocusElement: null,
//	prevFocusElement: null,
//	
//	
//	  afterRender : function() {
//        this.callParent(arguments);
//        
//        console.log("extend Ext.form.field.Base.initComponent ");
//        if (this.nextFocusElement != null && this._dcView_) {
//        	this.el.dom.setAttribute('aria-flowto', this._dcView_._getConfig_(this.nextFocusElement).id);
//        }
//    }
//    
//    
//    
//	 
//});
		
		
Ext.override(Ext.form.field.Text, {
			getRawValue : function() {
				var me = this, v = me.callParent();
				if (v === me.emptyText) {
					v = '';
				}
				if (this.caseRestriction && v != '') {
					if (this.caseRestriction == "uppercase") {
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
			extend : "Ext.form.field.Display",
			alias : "widget.displayfieldtext",

			asText : false,

			valueToRaw : function(value) {
				return value;
			},

			setRawValue : function(value) {
				var me = this;
				value = Ext.value(value, '');
				me.rawValue = value;
				if (me.rendered) {
					if (this.asText) {
						me.inputEl.dom.innerHTML = "<pre>" + value + "</pre>";
					} else {
						me.inputEl.dom.innerHTML = me.htmlEncode
								? Ext.util.Format.htmlEncode(value)
								: value;
					}

				}
				return value;
			}
		});

Ext.define("dnet.base.DisplayFieldDate", {
			extend : "Ext.form.field.Display",
			alias : "widget.displayfielddate",
			valueToRaw : function(value) {
				return Ext.util.Format.date(value, Dnet.DATE_FORMAT);
			}
		});

Ext.define("dnet.base.DisplayFieldNumber", {
			extend : "Ext.form.field.Display",
			alias : "widget.displayfieldnumber",

			valueToRaw : function(value) {
				return Ext.util.Format.number(value, this.format || "0");
			}
		});

Ext.define("dnet.base.DisplayFieldBoolean", {
			extend : "Ext.form.field.Display",
			alias : "widget.displayfieldboolean",
			renderer : function(rawValue, field) {
				if (rawValue === "false") {
					return Dnet.translate("msg", "bool_false");
				}
				return Dnet.translate("msg", "bool_" + (!!rawValue));
			}
		});

Ext.override(Ext.data.Store, {

			filterAllNew : function(item) {
				return item.phantom === true;
			},

			getAllNewRecords : function() {
				return this.data.filterBy(this.filterAllNew).items;
			},

			filterUpdated : function(item) {
				return item.dirty === true && item.phantom !== true;
			},
			getModifiedRecords : function() {
				return [].concat(this.getAllNewRecords(), this
								.getUpdatedRecords());
			}
		});

Ext.override(Ext.grid.plugin.CellEditing, {

	/**
	 * Context content { grid : grid, record : record, field :
	 * columnHeader.dataIndex, value : record.get(columnHeader.dataIndex), row :
	 * view.getNode(rowIdx), column : columnHeader, rowIdx : rowIdx, colIdx :
	 * colIdx }
	 * 
	 * @param {}
	 *            context
	 * @return {Boolean}
	 */
	beforeEdit : function(context) {
		if (context.grid && context.grid.beforeEdit) {
			return context.grid.beforeEdit(context);
		}
	},

	getEditor : function(record, column) {
		var me = this;
		if (me.grid._getCustomCellEditor_) {
			var editor = me.grid._getCustomCellEditor_(record, column);
			if (editor != null) {
				if (!this._isEditAllowed_(record, column, editor.field
								|| editor)) {
					return null;
				}

				if (!(editor instanceof Ext.grid.CellEditor)) {
					editorId = column.id + record.id;
					editor = new Ext.grid.CellEditor({
								editorId : editorId,
								field : editor,
								completeOnEnter: false,
								ownerCt : me.grid
							});
				}
				editor.editingPlugin = me;
				editor.isForTree = me.grid.isTree;
				editor.on({
							scope : me,
							specialkey : me.onSpecialKey,
							complete : me.onEditComplete,
							canceledit : me.cancelEdit
						});
				editor.field["_targetRecord_"] = record;
				return editor;
			}
		}

		var editor = this.callParent(arguments);
		if (editor
				&& !this
						._isEditAllowed_(record, column, editor.field || editor)) {
			return false;
		}
		if (editor.field) {
			editor.field["_targetRecord_"] = record;
		}
		return editor;

	},

	_isEditAllowed_ : function(record, column, field) {
		if (field && field.noEdit) {
			return false;
		}
		if (field && field.noUpdate === true && !record.phantom) {
			return false;
		} else if (field && field.noInsert === true && record.phantom) {
			return false;
		}
		return true;
	},
	
	onEditComplete : function(ed, value, startValue) {
        var me = this,
            grid = me.grid,
            activeColumn = me.getActiveColumn(),
            record;

        if (activeColumn) {
            record = me.context.record;

            me.setActiveEditor(null);
            me.setActiveColumn(null);
            me.setActiveRecord(null);
    
            if (!me.validateEdit()) {
                return;
            }
            // Only update the record if the new value is different than the
            // startValue. When the view refreshes its el will gain focus
            if (!record.isEqual(value, startValue)) {
                record.set(activeColumn.dataIndex, value);
            // Restore focus back to the view's element.
            } else {
                
            }
            grid.getView().getEl(activeColumn).focus();
            me.context.value = value;
            me.fireEvent('edit', me, me.context);
        }
    }

    
	
});