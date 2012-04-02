Ext.define("dnet.core.dc.AbstractDcvEditableGrid", {
	extend : "dnet.core.dc.AbstractDNetDcGrid",

	// **************** Properties *****************

	/**
	 * Component builder
	 * 
	 * @type dnet.core.dc.DcvEditableGridBuilder
	 */
	_builder_ : null,

	/**
	 * Flag to switch on/off bulk edit feature
	 * 
	 * @type Boolean
	 */
	_noBulkEdit_ : false,

	/**
	 * Array with field names which are allowed to be bulk-edited.
	 * 
	 * @type
	 */
	_bulkEditFields_ : null,

	/**
	 * Bulk-editor window.
	 * @type 
	 */
	_bulkEditWindow_: null,
	
	// **************** Public API *****************

	/**
	 * @public Returns the builder associated with this type of component. Each
	 *         predefined data-control view type has its own builder. If it
	 *         doesn't exist yet attempts to create it.
	 * 
	 * @return {dnet.core.dc.DcvEditableGridBuilder}
	 */
	_getBuilder_ : function() {
		if (this._builder_ == null) {
			this._builder_ = new dnet.core.dc.DcvEditableGridBuilder({
						dcv : this
					});
		}
		return this._builder_;
	},

	/**
	 * Show the bulk-edit window
	 */
	_doBulkEdit_ : function() {
		if (this._controller_.selectedRecords.length == 0) {
			Ext.Msg.show({
				title : "No records selected",
				msg : "Select the records for which you want to apply the changes.",
				icon : Ext.MessageBox.INFO,
				buttons : Ext.Msg.OK
			});
			return;
		}
		if (this._bulkEditWindow_ == null) {
			this._bulkEditWindow_ = new dnet.core.dc.BulkEditWindow({
					_grid_ : this
				});
		}		
		this._bulkEditWindow_.show();
	},

	// **************** Defaults and overrides *****************

	clicksToEdit : 1,

	/**
	 * 
	 * Override the parent method to add specific functions
	 * 
	 * @param {}
	 *            bbitems
	 */
	_buildToolbox_ : function(bbitems) {
		this.callParent(arguments);
		if (!this._noBulkEdit_ && this._bulkEditFields_ != null
				&& this._bulkEditFields_.length > 0) {
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnBulkEdit_"));
		}
	},

	/**
	 * Override parent to add specific elements.
	 */
	_defineDefaultElements_ : function() {
		this.callParent(arguments);
		this._elems_.add("_btnBulkEdit_", {
					xtype : "button",
					id : Ext.id(),
					// text : Dnet.translate("dcvgrid", "btn_bulkedit"),
					tooltip : Dnet.translate("dcvgrid", "btn_bulkedit_tlp"),
					iconCls : 'icon-action-edit',
					handler : this._doBulkEdit_,
					scope : this
				});
	},

	// **************** Private methods *****************

	initComponent : function(config) {	
		if (! this._controller_.multiEdit ) {
			throw new Exception("Editable grids should be used with data-controls having multiEdit enabled.");
		}
		this._initDcGrid_();
		var cfg = this._createDefaultGridConfig_();
		  
		this.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
				})];
  
		Ext.apply(cfg, {
			selModel : {
				mode : "MULTI",
				listeners : {
					"selectionchange" : {
						scope : this,
						fn : this._selectionHandler_ ,
						buffer: 200
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
		});

		if (this._noPaginator_) {
			this._noBulkEdit_ = true; 
		}
		Ext.apply(this, cfg);
		this.callParent(arguments);
		this._registerListeners_();
 
		this.on("afteredit", this._afterEdit_, this);
		  
	},
	
	_afterEdit_: function() {
		
	}
	 

});
