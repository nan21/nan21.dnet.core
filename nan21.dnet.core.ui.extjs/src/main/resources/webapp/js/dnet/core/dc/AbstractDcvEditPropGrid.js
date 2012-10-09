Ext.define("dnet.core.dc.AbstractDcvEditPropGrid", {
			extend : "dnet.core.dc.AbstractDNetDcPropGrid",

			// **************** Properties *****************
			/**
			 * Component builder
			 * 
			 * @type dnet.core.dc.DcvEditPropGridBuilder
			 */
			_builder_ : null,

			/**
			 * Helper property to identify this dc-view type as filter property
			 * grid.
			 * 
			 * @type String
			 */
			_dcViewType_ : "edit-propgrid",

			// **************** Public API *****************

			/**
			 * @public Returns the builder associated with this type of
			 *         component. Each predefined data-control view type has its
			 *         own builder. If it doesn't exist yet attempts to create
			 *         it.
			 * 
			 * @return {dnet.core.dc.DcvEditPropGridBuilder}
			 */
			_getBuilder_ : function() {
				if (this._builder_ == null) {
					this._builder_ = new dnet.core.dc.DcvEditPropGridBuilder({
								dcv : this
							});
				}
				return this._builder_;
			},

			// **************** Defaults and overrides *****************

			initComponent : function(config) {
				this._runElementBuilder_();
				var sourceObj = {};
				var propertyNames = {};
				var customEditors = {};
				var customRenderers = {};

				var fnSourceObj = function(item, idx, len) {
					sourceObj[item.name] = item._default_;
				};
				var fnPropertyName = function(item, idx, len) {
					propertyNames[item.name] = item.fieldLabel;
				};
				var fnCustomEditors = function(item, idx, len) {
					if (item.editorInstance) {
						customEditors[item.name] = item.editorInstance;	
					}
				};
				var fnCustomRenderers = function(item, idx, len) {
					if ( item.renderer ) {
						customRenderers[item.name] = item.renderer;
					}
				};

				this._elems_.each(fnSourceObj, this);
				this._elems_.each(fnPropertyName, this);
				this._elems_.each(fnCustomEditors, this);
				this._elems_.each(fnCustomRenderers, this);

				var cfg = {
					autoScroll : true,
					source : sourceObj,
					propertyNames : propertyNames,
					customEditors : customEditors,
					customRenderers : customRenderers
				};
				Ext.apply(this, cfg);
				this.callParent(arguments);
				this._registerListeners_();
			},

			/**
			 * After the form is rendered invoke the record binding. This is
			 * necessary as the form may be rendered lazily(delayed) and the
			 * data-control may already have a current record set.
			 */
			afterRender : function() {
				this.callParent(arguments);
				if (this._controller_ && this._controller_.getRecord()) {
					this._onBind_(this._controller_.getRecord());
				} else {
					this._onUnbind_(null);
				}
			},

			// **************** Private API *****************

			/**
			 * Register event listeners
			 */
			_registerListeners_ : function() {

				this.mon(this._controller_.store, "datachanged",
						this._onStore_datachanged_, this);
				this.mon(this._controller_.store, "update",
						this._onStore_update_, this);
				this.mon(this._controller_.store, "write",
						this._onStore_write_, this);

				this.mon(this._controller_, "recordChange",
						this._onController_recordChange_, this);

				this.mon(this._controller_, "parameterValueChanged",
						this._onParameterValueChanged_, this);
 
				this.mon(this, "edit", function(editor, evnt, eOpts) { 
							 this._controller_.getRecord().set(evnt.record.data.name,
							 evnt.value);
							return true;
						}, this);
			},

			/**
			 * Bind the current filter model of the data-control to the form.
			 * 
			 * @param {Ext.data.Model}
			 *            record The record to bind
			 */
			_onBind_ : function(record) {
				this._updateBound_(record);
				this._applyStates_(record);
				this._afterBind_(record);
			},

			/**
			 * Un-bind the filter from the form.
			 * 
			 * @param {Ext.data.Model}
			 *            record
			 */
			_onUnbind_ : function(record) {
				this._updateBound_(record);
				this._afterUnbind_(record);
			},

			/**
			 * When the filter has been changed in any way other than user
			 * interaction, update the fields of the form with the changed
			 * values from the model. Such change may happen by custom code
			 * snippets updating the model in a beginEdit-endEdit block,
			 * filter-service methods which returns changed data from server,
			 * etc.
			 * 
			 * @param {Ext.data.Model}
			 *            filter
			 */
			_updateBound_ : function(record) {
				if (!record) {
					this.disable();
					// this.form.reset();
				} else {
					if (this.disabled) {
						this.enable();
					}
					var s = this.getSource();
					for (var p in s) {
						if (record.data.hasOwnProperty(p)) {
							this.setProperty(p, record.data[p], true);
						}
					}
				}
			},

			 
			/**
			 * @private The parameters model is not part of a store, so we have
			 *          listen to changes made to the model through the
			 *          `parameterValueChanged` event raised by the
			 *          data-control. Changes to the parameters model should be
			 *          done through the setParamValue method of the
			 *          data-control in order to be listened and picked-up to
			 *          refresh the correcponding form fields.
			 * 
			 * @param {dnet.core.dc.AbstractDc}
			 *            dc The controller
			 * @param {String}
			 *            property The parameters property which has been
			 *            changed
			 * @param {Object}
			 *            ov Old value
			 * @param {Object}
			 *            nv New value
			 */
			_onParameterValueChanged_ : function(dc, property, ov, nv) {
				var s = this.getSource();

				if (s.hasOwnProperty(property)) {
					this.setProperty(property, nv, false);
				}
			},

			/**
			 * @private Update the bound record when the store data is changed.
			 * @param {}
			 *            store
			 * @param {}
			 *            eopts
			 */
			_onStore_datachanged_ : function(store, eopts) {
				this._updateBound_(this._controller_.getRecord());
			},

			/**
			 * @private Update the bound record when the store data is updated.
			 * @param {}
			 *            store
			 * @param {}
			 *            rec
			 * @param {}
			 *            op
			 * @param {}
			 *            eopts
			 */
			_onStore_update_ : function(store, rec, op, eopts) {
				this._updateBound_(rec);
			},

			/**
			 * @private Update the bound record after a succesful save.
			 * @param {}
			 *            store
			 * @param {}
			 *            operation
			 * @param {}
			 *            eopts
			 */
			_onStore_write_ : function(store, operation, eopts) {
				/**
				 * use the first record from the result list as reference see
				 * Store on write event handler defined in AbstractDc.
				 */
				if (operation.action == "create") {
					this._applyContextRules_(operation.resultSet.records[0]);
				}
			},

			/**
			 * @private When the current record of the data-control is changed
			 *          bind it to the form.
			 * @param {}
			 *            evnt
			 */
			_onController_recordChange_ : function(evnt) {
				var newRecord = evnt.newRecord;
				var oldRecord = evnt.oldRecord;
				var newIdx = evnt.newIdx;
				if (newRecord != oldRecord) {
					this._onUnbind_(oldRecord);
					this._onBind_(newRecord);
				}
			}
		});