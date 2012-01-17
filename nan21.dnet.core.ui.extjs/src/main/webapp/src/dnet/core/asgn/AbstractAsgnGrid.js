Ext.define("dnet.core.asgn.AbstractAsgnGrid", {
	extend : "Ext.grid.Panel",

	// DNet properties

	_builder_ : null,
	_columns_ : null,
	_elems_ : null,
	_controller_ : null,
	_side_ : null,

	// defaults

	forceFit : true,
	loadMask : true,
	stripeRows : true,
	border : true,
	frame : true,

	viewConfig : {
		emptyText : "No records found to match the selection criteria."
	},

	initComponent : function(config) {
		this._elems_ = new Ext.util.MixedCollection();
		this._columns_ = new Ext.util.MixedCollection();

		this._startDefine_();
		this._defineDefaultElements_();

		if (this._beforeDefineColumns_() !== false) {
			this._defineColumns_();
		}
		this._afterDefineColumns_();

		this._endDefine_();

		var cfg = {

			columns : this._columns_.getRange(),
			store : this._controller_.getStore(this._side_),
			selModel : {
				mode : "MULTI"
			},
			bbar : {
				xtype : "pagingtoolbar",
				store : this._controller_.getStore(this._side_),
				displayInfo : true
			}
 
		};
		Ext.apply(cfg, config);
		Ext.apply(this, cfg);
		this.callParent(arguments);

	},

	_getElement_ : function(name) {
		return Ext.getCmp(this._elems_.get(name).id);
	},

	_getElementConfig_ : function(name) {
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
	},

	_onStoreLoad_ : function(store, records, options) {
	},

	_afterEdit_ : function(e) {
	},

	/**
	 * Returns the builder.
	 */
	_getBuilder_ : function() {
		if (this._builder_ == null) {
			this._builder_ = new dnet.core.asgn.AsgnGridBuilder( {
				asgnGrid : this
			});
		}
		return this._builder_;
	}

});