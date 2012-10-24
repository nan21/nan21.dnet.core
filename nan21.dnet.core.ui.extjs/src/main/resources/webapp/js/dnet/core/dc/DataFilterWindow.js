Ext.define("dnet.core.dc.DataFilterWindow", {
	extend : "Ext.Window",

	/**
	 * Target grid on which this advanced filter operates.
	 */
	_grid_ : null,

	/**
	 * The filter grid component.
	 */
	_filterGrid_ : null,

	/**
	 * Filter grid's store
	 */
	_filterStore_ : null,

	initComponent : function(config) {
		this._buildElements_();
		var cfg = {
			title : Dnet.translate("dcvgrid", "filter_title"),
			border : true,
			width : 500,
			// height:200,
			closeAction : "hide",
			closable : true,
			constrain : true,
			layout : "fit",
			buttonAlign : "center",
			modal : true,
			items : this._filterGrid_,
			buttons : this._buildButtons_()
		};

		Ext.apply(this, cfg, config);
		this.callParent(arguments);
	},

	_onApply_ : function() {
		var ctrl = this._grid_._controller_;
		var fr = [];
		this._filterStore_.data.each(function(item, idx, len) {
			var r = {
				fieldName : item.data.field,
				operation : item.data.operation,
				value1 : item.data.value1,
				value2 : item.data.value2
			}
			fr[fr.length] = r;
		});
		ctrl.advancedFilter = fr;
		ctrl.doQuery();
		this.close();
	},

	_onClear_ : function() {
		this._filterStore_.removeAll();
		this._grid_._controller_.advancedFilter = null;
		this._grid_._controller_.doQuery();
		this.close();
	},

	_onRemove_ : function() {
		this._filterStore_.remove(this._filterGrid_.getSelectionModel()
				.getSelection());
		var r = this._filterStore_.first();
		this._filterGrid_.getSelectionModel().select(r);
	},

	_onAdd_ : function() {
		this._filterStore_.add({});
		var r = this._filterStore_.last();
		this._filterGrid_.getSelectionModel().select(r);
	},

	_onCopy_ : function() {
		var s = this._filterGrid_.getSelectionModel().getSelection()[0].data;
		this._filterStore_.add({
			field : s.field,
			operation : s.operation,
			value1 : s.value1,
			value2 : s.value2
		});
		var r = this._filterStore_.last();
		this._filterGrid_.getSelectionModel().select(r);
	},

	_buildElements_ : function() {

		var af = this._grid_._controller_.advancedFilter;
		var _items = [];
		if (af != null && Ext.isArray(af)) {
			for ( var i = 0, len = af.length; i < len; i++) {
				var r = {
					field : af[i].fieldName,
					operation : af[i].operation,
					value1 : af[i].value1,
					value2 : af[i].value2
				}
				_items[_items.length] = r;
			}
		}

		this._filterStore_ = Ext.create("Ext.data.Store", {
			fields : [ "field", "operation", "value1", "value2" ],
			data : {
				"items" : _items
			},
			proxy : {
				type : "memory",
				reader : {
					type : "json",
					root : "items"
				}
			}
		});

		this._filterGrid_ = Ext.create("Ext.grid.Panel", {
			height : 200,
			plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			}) ],
			store : this._filterStore_,
			dockedItems : [ {
				xtype : 'toolbar',
				dock : 'top',
				items : this._buildFilterGridActions_()
			} ],
			columns : this._buildFilterGridColumns_()
		});
	},

	/**
	 * Create window level buttons.
	 */
	_buildButtons_ : function() {
		return [ {
			text : Dnet.translate("dcvgrid", "filter_apply"),
			iconCls : "icon-action-filter",
			scope : this,
			handler : this._onApply_
		}, {
			text : Dnet.translate("dcvgrid", "filter_clear"),
			iconCls : "icon-action-rollback",
			scope : this,
			handler : this._onClear_
		} ];
	},

	/**
	 * Build toolbar actions.
	 */
	_buildFilterGridActions_ : function() {
		return [ {
			text : 'Add',
			tooltip : 'Add new filter criteria',
			scope : this,
			handler : this._onAdd_
		}, {
			text : 'Copy',
			tooltip : 'Copy selected criteria',
			scope : this,
			handler : this._onCopy_
		}, {
			text : 'Remove',
			tooltip : 'Remove selected criteria',
			scope : this,
			handler : this._onRemove_
		} ]
	},

	/**
	 * Build the filter-grid columns.
	 */
	_buildFilterGridColumns_ : function() {
		var _data = [];
		this._grid_._controller_.filter.fields.each(function(item, idx, len) {
			if (!item.name.endsWith("_From") && !item.name.endsWith("_To")) {
				_data[_data.length] = {
					name : item.name,
					type : item.type
				}
			}
		})
		var _column_fiel_store = {
			fields : [ "name", "type" ],
			data : _data
		};

		return [
				{
					text : "Field",
					dataIndex : "field",
					width : 150,
					editor : {
						xtype : "combo",
						selectOnFocus : true,
						typeAhead : true,
						queryMode : "local",
						displayField : "name",
						store : _column_fiel_store
					}
				},
				{
					text : "Operation",
					dataIndex : "operation",
					editor : {
						xtype : "combo",
						selectOnFocus : true,
						typeAhead : true,
						queryMode : "local",
						store : [ "=", "<>", "<", "<=", ">", ">=", "like",
								"not like", "in", "not in", "between" ]
					}
				}, {
					text : "Value 1",
					dataIndex : "value1",
					editor : {
						xtype : "textfield",
						selectOnFocus : true
					}
				}, {
					text : "Value 2",
					dataIndex : "value2",
					editor : {
						xtype : "textfield",
						selectOnFocus : true
					}
				} ];
	}

});