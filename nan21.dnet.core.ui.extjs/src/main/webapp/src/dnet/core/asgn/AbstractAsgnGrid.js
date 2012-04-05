Ext.define("dnet.core.asgn.AbstractAsgnGrid", {
			extend : "Ext.grid.Panel",

			mixins : {
				elemBuilder : "dnet.core.base.AbstractDNetView"
			},

			// **************** Properties *****************

			
			/**
			 * Component builder
			 * 
			 * @type dnet.core.asgn.AsgnGridBuilder
			 */
			_builder_ : null,

			/**
			 * Assignment controller
			 * 
			 * @type dnet.core.asgn.AbstractAsgn
			 */
			_controller_ : null,

			/**
			 * Which grid is implemented. Possible values are left(for
			 * available) and right(for selected)
			 * 
			 * @type String
			 */
			_side_ : null,
			
			_columns_ : null,


			// **************** Public API *****************

			/**
			 * Returns the builder.
			 */
			_getBuilder_ : function() {
				if (this._builder_ == null) {
					this._builder_ = new dnet.core.asgn.AsgnGridBuilder({
								asgnGrid : this
							});
				}
				return this._builder_;
			},

			// **************** Defaults and overrides *****************

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

			_defineColumns_ : function() {
			},

			_beforeDefineColumns_ : function() {
				return true;
			},

			_afterDefineColumns_ : function() {
			},

			_defineDefaultElements_ : function() {
			},

			_onStoreLoad_ : function(store, records, options) {
			},

			_afterEdit_ : function(e) {
			}

		});