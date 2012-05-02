Ext.define("dnet.core.dc.AbstractDcvGrid", {
	extend : "dnet.core.dc.AbstractDNetDcGrid",

  
	// **************** Properties *****************
	
	/**
	 * Component builder
	 * @type dnet.core.dc.DcvGridBuilder
	 */
	_builder_ : null,
	

	// **************** Public API *****************
	
	
	/**
	 * @public Returns the builder associated with this type of component. Each
	 *         predefined data-control view type has its own builder.
	 *         If it doesn't exist yet attempts to create it.
	 * 
	 * @return {dnet.core.dc.DcvGridBuilder}
	 */
	_getBuilder_ : function() {
		if (this._builder_ == null) {
			this._builder_ = new dnet.core.dc.DcvGridBuilder( {
				dcv : this
			});
		}
		return this._builder_;
	},
 
 	// **************** Private methods *****************
	
	initComponent : function(config) {

		this._initDcGrid_();
		var cfg = this._createDefaultGridConfig_();
		this.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 2
					
				})];
		Ext.apply(cfg, {			
			selModel : {
				mode : "MULTI",
				listeners : {
					"selectionchange" : {
						scope : this,
						fn : this._selectionHandler_ ,
						buffer: 200
						 
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
			},
			listeners : {
				"itemdblclick" : {
					scope : this,
					fn : function(view, model, item, idx, evnt, evntOpts) {
						if(evnt.altKey === false) {
							this._controller_.onEdit();
						}
					}
				}
			}
 
		});
		 
		Ext.apply(this, cfg);
		this.callParent(arguments);
		this._registerListeners_();
	}
});