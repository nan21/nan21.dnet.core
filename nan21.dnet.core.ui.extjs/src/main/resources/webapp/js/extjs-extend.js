/* ==================== general javascript overrides======================== */

String.prototype.endsWith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

/* ==================== Extjs overrides======================== */

Ext.override(Ext.form.field.Picker, {
	collapse : function() {
		if (this.isExpanded && !this.isDestroyed) {
			var me = this, openCls = me.openCls, picker = me.picker, doc = Ext
					.getDoc(), collapseIf = me.collapseIf, aboveSfx = '-above';

			// hide the picker and set isExpanded flag
			picker.hide();
			me.isExpanded = false;

			// remove the openCls
			me.bodyEl.removeCls([ openCls, openCls + aboveSfx ]);
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
			return f.dataIndex === id || f.id === id || f.getName() === id;
		});
	}
});

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
		return [].concat(this.getAllNewRecords(), this.getUpdatedRecords());
	},

	rejectChanges : function() {
		this.callParent();
		this.fireEvent('changes_rejected', this);
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
		var me = this;
		var grid = me.grid;
		var activeColumn = me.getActiveColumn();
		var record;

		if (activeColumn) {
			record = me.context.record;

			me.setActiveEditor(null);
			me.setActiveColumn(null);
			me.setActiveRecord(null);

			if (!me.validateEdit()) {
				return;
			}
			/*
			 * Only update the record if the new value is different than the
			 * startValue. When the view refreshes its el will gain focus
			 */
			if (!record.isEqual(value, startValue)) {
				record.set(activeColumn.dataIndex, value);
				// Restore focus back to the view's element.
			} else {

			}
			grid.getView().getEl(activeColumn).focus();
			me.context.value = value;
			me.fireEvent('edit', me, me.context);
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
						completeOnEnter : false,
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
		var editAllowed = this._isEditAllowed_(record, column, editor.field
				|| editor);
		if (editor && !editAllowed) {
			return false;
		}

		if (editor.field) {
			editor.field["_targetRecord_"] = record;
		}

		return editor;
	}

});